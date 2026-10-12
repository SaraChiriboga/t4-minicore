class Regla < BaseModel
  table do
    column monto_minimo : Float64
    column porcentaje_comision : Float64
  end
end