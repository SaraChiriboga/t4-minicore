abstract class ApiAction < Lucky::Action
  disable_cookies
  accepted_formats [:json]

  include Api::Auth::Helpers
  include Api::Auth::RequireAuthToken
  include Lucky::EnforceUnderscoredRoute

  private def require_admin
    if current_user.role.admin?
      continue
    else
      json({ message: "Acceso denegado: se requieren permisos de administrador." }, status: 403)
    end
  end

  private def require_vendedor
    if current_user.role.regular?
      continue
    else
      json({ message: "Acceso denegado: se requiere ser un vendedor registrado." }, status: 403)
    end
  end

  private def require_admin_or_vendedor
    if current_user.role.admin? || current_user.role.regular?
      continue
    else
      json({ message: "Acceso denegado: credenciales insuficientes." }, status: 403)
    end
  end

  # recupera o asigna de forma segura el id del vendedor para el usuario actual
  private def current_user_vendedor_id : Int64
    if vid = current_user.vendedor_id
      if VendedorQuery.new.id(vid).first?
        return vid
      end
    end

    nombre = "#{current_user.name} #{current_user.last_name}".strip
    nombre = current_user.email if nombre.blank?
    cedula = current_user.phone.presence || "17#{current_user.id.to_s.rjust(8, '0')}"

    v = VendedorQuery.new.identificacion(cedula).first? || SaveVendedor.create!(nombre: nombre, identificacion: cedula)
    UpdateUser.update!(current_user, vendedor_id: v.id)
    v.id
  end
end
