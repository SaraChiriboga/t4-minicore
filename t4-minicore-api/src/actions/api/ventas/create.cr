class Api::Ventas::Create < ApiAction
  before require_admin_or_vendedor

  post "/api/ventas" do
    if current_user.role.regular?
      vid = current_user.vendedor_id.not_nil!
      SaveVenta.create(params, vendedor_id: vid) do |operation, venta|
        if venta
          json VentaSerializer.new(venta), status: 201
        else
          raise Avram::InvalidOperationError.new(operation)
        end
      end
    else
      SaveVenta.create(params) do |operation, venta|
        if venta
          json VentaSerializer.new(venta), status: 201
        else
          raise Avram::InvalidOperationError.new(operation)
        end
      end
    end
  end
end
