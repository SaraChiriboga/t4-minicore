class Api::Vendedor::Delete < ApiAction
  before require_admin

  delete "/api/vendedor/:vendedor_id" do
    VendedorQuery.find(vendedor_id).delete
    json({ message: "Vendedor eliminado correctamente" })
  end
end
