class Api::Vendedor::Show < ApiAction
  before require_admin

  get "/api/vendedor/:vendedor_id" do
    vendedor = VendedorQuery.find(vendedor_id)
    json VendedorSerializer.new(vendedor)
  end
end
