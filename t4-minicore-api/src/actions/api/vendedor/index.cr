class Api::Vendedor::Index < ApiAction
  before require_admin

  get "/api/vendedor" do
    vendedores = VendedorQuery.new
    json VendedorSerializer.for_collection(vendedores)
  end
end
