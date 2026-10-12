class VentaSerializer < BaseSerializer
  def initialize(@venta : Venta)
  end

  def render
    {
    id: @venta.id,
    monto: @venta.monto,
    fecha: @venta.fecha,
    vendedor_id: @venta.vendedor_id
  }
  end
end