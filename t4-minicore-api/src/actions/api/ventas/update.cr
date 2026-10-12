class Api::Ventas::Update < ApiAction
  before require_admin

  put "/api/ventas/:venta_id" do
    venta = VentaQuery.find(venta_id)
    SaveVenta.update(venta, params) do |operation, updated_venta|
      if updated_venta
        json VentaSerializer.new(updated_venta), status: 200
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end
