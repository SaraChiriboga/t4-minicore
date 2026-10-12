class ComisionSerializer < BaseSerializer
  def initialize(
    @vendedor : Vendedor,
    @total_vendido : Float64,
    @porcentaje_comision : Float64,
    @comision_calculada : Float64
  )
  end

  def render
    {
      vendedor_id:        @vendedor.id,
      nombre:             @vendedor.nombre,
      identificacion:     @vendedor.identificacion,
      total_vendido:      @total_vendido,
      porcentaje_comision: @porcentaje_comision,
      comision_calculada: @comision_calculada,
    }
  end
end