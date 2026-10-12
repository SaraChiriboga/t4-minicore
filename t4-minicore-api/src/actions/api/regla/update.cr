class Api::Regla::Update < ApiAction
  before require_admin

  put "/api/regla/:regla_id" do
    regla = ReglaQuery.new.id(regla_id).first?
    if regla.nil?
      json({ message: "Regla no encontrada" }, status: 404)
    else
      SaveRegla.update(regla, params) do |operation, updated_regla|
        if updated_regla
          json ReglaSerializer.new(updated_regla), status: 200
        else
          raise Avram::InvalidOperationError.new(operation)
        end
      end
    end
  end
end
