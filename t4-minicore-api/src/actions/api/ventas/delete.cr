class Api::Ventas::Delete < ApiAction
  before require_admin

  delete "/api/ventas/:venta_id" do
    VentaQuery.find(venta_id).delete
    json({ message: "Venta eliminada correctamente" })
  end
end
