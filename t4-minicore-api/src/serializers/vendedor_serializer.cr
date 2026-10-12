class VendedorSerializer < BaseSerializer
  def initialize(@vendedor : Vendedor)
  end

  def render
    {
      id:             @vendedor.id,
      nombre:         @vendedor.nombre,
      identificacion: @vendedor.identificacion,
    }
  end
end