class Api::Vendedor::Update < ApiAction
  before require_admin

  put "/api/vendedor/:vendedor_id" do
    vendedor = VendedorQuery.new.id(vendedor_id).first?
    if vendedor.nil?
      json({ message: "Vendedor no encontrado" }, status: 404)
    else
      SaveVendedor.update(vendedor, params) do |operation, updated_vendedor|
        if updated_vendedor
          json VendedorSerializer.new(updated_vendedor), status: 200
        else
          raise Avram::InvalidOperationError.new(operation)
        end
      end
    end
  end
end