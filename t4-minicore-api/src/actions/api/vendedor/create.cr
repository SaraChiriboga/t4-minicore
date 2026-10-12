class Api::Vendedor::Create < ApiAction
  before require_admin

  post "/api/vendedor" do
    SaveVendedor.create(params) do |operation, vendedor|
      if vendedor
        json VendedorSerializer.new(vendedor), status: 201
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end
