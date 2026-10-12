class Vendedor < BaseModel
  table do
    column nombre : String
    column identificacion : String

    # relación inversa: Un vendedor tiene muchas ventas
    has_many ventas : Venta
  end
end