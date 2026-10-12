class ReglaSerializer < BaseSerializer
  def initialize(@regla : Regla)
  end

  def render
    {
    monto_minimo: @regla.monto_minimo,
    porcentaje_comision: @regla.porcentaje_comision
  }
  end
end