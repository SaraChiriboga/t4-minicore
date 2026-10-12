require "../../../spec/support/factories/**"

class Db::Seed::SampleData < LuckyTask::Task
  summary "Add sample database records helpful for development"

  def call
    if ReglaQuery.new.monto_minimo(1000.0).none?
      SaveRegla.create!(monto_minimo: 1000.0, porcentaje_comision: 5.0)
    end

    if ReglaQuery.new.monto_minimo(5000.0).none?
      SaveRegla.create!(monto_minimo: 5000.0, porcentaje_comision: 10.0)
    end

    vendedor_1 = VendedorQuery.new.identificacion("1712345678").first? || SaveVendedor.create!(
      nombre: "Sara Chiriboga",
      identificacion: "1712345678"
    )

    vendedor_2 = VendedorQuery.new.identificacion("0912345678").first? || SaveVendedor.create!(
      nombre: "Connie Terán",
      identificacion: "0912345678"
    )

    if VentaQuery.new.none?
      SaveVenta.create!(
        monto: 1500.50,
        fecha: Time.utc,
        vendedor_id: vendedor_1.id
      )

      SaveVenta.create!(
        monto: 6200.00,
        fecha: Time.utc - 2.days,
        vendedor_id: vendedor_1.id
      )

      SaveVenta.create!(
        monto: 450.00,
        fecha: Time.utc,
        vendedor_id: vendedor_2.id
      )
    end

    if UserQuery.new.email("admin@t4-minicore.com").none?
      SignUpUser.create!(
        email: "admin@t4-minicore.com",
        password: "password123",
        password_confirmation: "password123",
        name: "Admin",
        last_name: "Principal",
        phone: "0999999999",
        role: User::Role::Admin
      )
    end

    if UserQuery.new.email("vendedor@t4-minicore.com").none?
      SignUpUser.create!(
        email: "vendedor@t4-minicore.com",
        password: "password123",
        password_confirmation: "password123",
        name: "Sara",
        last_name: "Chiriboga",
        phone: "1712345678",
        role: User::Role::Regular,
        vendedor_id: vendedor_1.id
      )
    end

    puts "Done adding sample data"
  end
end
