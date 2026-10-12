class Api::Ventas::Show < ApiAction
  before require_admin_or_vendedor

  get "/api/ventas/:venta_id" do
    venta = VentaQuery.find(venta_id)
    if current_user.role.regular? && venta.vendedor_id != current_user.vendedor_id
      json({ message: "Acceso denegado: no puedes consultar ventas de otros vendedores." }, status: 403)
    else
      json VentaSerializer.new(venta)
    end
  end
end
