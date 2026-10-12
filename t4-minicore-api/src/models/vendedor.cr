class Vendedor < BaseModel
  table do
    column nombre : String
    column identificacion : String

    has_many ventas : Venta
    has_one user : User?
  end
end