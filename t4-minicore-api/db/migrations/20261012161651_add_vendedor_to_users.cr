class AddVendedorToUsers::V20261012161651 < Avram::Migrator::Migration::V1
  def migrate
    enable_extension "citext"

    create table_for(User) do
      primary_key id : Int64
      add_timestamps
      add email : String, unique: true, case_sensitive: false
      add encrypted_password : String
      add role : Int32, default: 0
      add name : String, default: ""
      add last_name : String, default: ""
      add phone : String, default: ""
      add_belongs_to vendedor : Vendedor?, on_delete: :nullify, references: :vendedors
    end
  end

  def rollback
    drop table_for(User)
  end
end
