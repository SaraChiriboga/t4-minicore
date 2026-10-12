class MainTables::V20261012044407 < Avram::Migrator::Migration::V1
  def migrate
    # tabla vendedores
    create table_for(Vendedor) do
      primary_key id : Int64
      add nombre : String
      add identificacion : String
      add_timestamps
    end

    # tabla ventas
    create table_for(Venta) do
      primary_key id : Int64
      add monto : Float64
      add fecha : Time
      add_belongs_to vendedor : Vendedor, on_delete: :cascade, foreign_key_type: Int64
      add_timestamps
    end

    # tabla reglas
    create table_for(Regla) do
      primary_key id : Int64
      add monto_minimo : Float64
      add porcentaje_comision : Float64
      add_timestamps
    end
  end

  def rollback
    drop table_for(Regla), if_exists: true
    drop table_for(Venta), if_exists: true
    drop table_for(Vendedor), if_exists: true
  end
end
