class Api::Vendedor::Update < ApiAction
  before require_admin

  put "/api/vendedor/:vendedor_id" do
    vendedor = VendedorQuery.find(vendedor_id)
    SaveVendedor.update(vendedor, params) do |operation, updated_vendedor|
      if updated_vendedor
        json VendedorSerializer.new(updated_vendedor), status: 200
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end