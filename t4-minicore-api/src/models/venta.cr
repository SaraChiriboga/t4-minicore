class Venta < BaseModel
  table do
    column monto : Float64
    column fecha : Time

    # realcion: La venta pertenece a un vendedor
    belongs_to vendedor : Vendedor
  end
end