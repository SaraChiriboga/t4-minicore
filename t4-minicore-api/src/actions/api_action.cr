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
    if current_user.role.regular? && current_user.vendedor_id
      continue
    else
      json({ message: "Acceso denegado: se requiere ser un vendedor registrado." }, status: 403)
    end
  end

  private def require_admin_or_vendedor
    if current_user.role.admin? || (current_user.role.regular? && current_user.vendedor_id)
      continue
    else
      json({ message: "Acceso denegado: credenciales insuficientes." }, status: 403)
    end
  end
end
