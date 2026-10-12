class Api::Vendedor::Delete < ApiAction
  before require_admin

  delete "/api/vendedor/:vendedor_id" do
    vendedor = VendedorQuery.new.id(vendedor_id).first?
    if vendedor
      vendedor.delete
      json({ message: "Vendedor eliminado correctamente" })
    else
      json({ message: "Vendedor no encontrado" }, status: 404)
    end
  end
end
