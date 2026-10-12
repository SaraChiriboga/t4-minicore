require "../../../spec/support/factories/**"

# Add sample data helpful for development, e.g. (fake users, blog posts, etc.)
#
# Use `Db::Seed::RequiredData` if you need to create data *required* for your
# app to work.
class Db::Seed::SampleData < LuckyTask::Task
  summary "Add sample database records helpful for development"

  def call
    # Using an Avram::Factory:
    #
    # Use the defaults, but override just the email
    # UserFactory.create &.email("me@example.com")

    # Using a SaveOperation:
    # ```
    # SignUpUser.create!(email: "me@example.com", password: "test123", password_confirmation: "test123")
    # ```
    #
    # You likely want to be able to run this file more than once. To do that,
    # only create the record if it doesn't exist yet:
    # ```
    # if UserQuery.new.email("me@example.com").none?
    #   SignUpUser.create!(email: "me@example.com", password: "test123", password_confirmation: "test123")
    # end
    # ```

    # insertar reglas de comisión
    SaveRegla.create!(monto_minimo: 1000.0, porcentaje_comision: 5.0)
    SaveRegla.create!(monto_minimo: 5000.0, porcentaje_comision: 10.0)

    # insertar vendedores
    vendedor_1 = SaveVendedor.create!(
      nombre: "Sara Chiriboga",
      identificacion: "1712345678"
    )

    vendedor_2 = SaveVendedor.create!(
      nombre: "Connie Terán",
      identificacion: "0912345678"
    )

    # insertar ventas asociadas a los vendedores
    SaveVenta.create!(
      monto: 1500.50,
      fecha: Time.utc,
      vendedor_id: vendedor_1.id
    )

    SaveVenta.create!(
      monto: 6200.00,
      fecha: Time.utc - 2.days, # Hace dos días
      vendedor_id: vendedor_1.id
    )

    SaveVenta.create!(
      monto: 450.00,
      fecha: Time.utc,
      vendedor_id: vendedor_2.id
    )
    

    puts "Done adding sample data"
  end
end
