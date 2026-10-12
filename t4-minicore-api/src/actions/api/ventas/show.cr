class Api::Ventas::Show < ApiAction
  before require_admin_or_vendedor

  get "/api/ventas/:venta_id" do
    venta = VentaQuery.new.preload_vendedor.id(venta_id).first?

    if venta.nil?
      json({ message: "Venta no encontrada" }, status: 404)
    elsif current_user.role.regular? && venta.vendedor_id != current_user_vendedor_id
      json({ message: "Acceso denegado a esta venta" }, status: 403)
    else
      json VentaSerializer.new(venta)
    end
  end
end
