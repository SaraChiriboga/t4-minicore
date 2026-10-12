class Api::SignIns::Create < ApiAction
  include Api::Auth::SkipRequireAuthToken

  post "/api/sign_ins" do
    SignInUser.run(params) do |operation, user|
      if user
        # si es usuario regular nos aseguramos de que siempre tenga un vendedor vinculado
        if user.role.regular?
          vid = user.vendedor_id
          vendedor_valido = vid ? VendedorQuery.new.id(vid).first? : nil

          if vendedor_valido.nil?
            nombre_completo = "#{user.name} #{user.last_name}".strip
            nombre_completo = user.email if nombre_completo.blank?
            cedula = user.phone.presence || "17#{user.id.to_s.rjust(8, '0')}"

            vendedor_record = VendedorQuery.new.identificacion(cedula).first? || SaveVendedor.create!(
              nombre: nombre_completo,
              identificacion: cedula
            )
            user = UpdateUser.update!(user, vendedor_id: vendedor_record.id)
          end
        end

        json({token: UserToken.generate(user), user: UserSerializer.new(user)})
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end
