class SaveVenta < Venta::SaveOperation
  permit_columns monto, fecha, vendedor_id

  before_save do
    normalize_fecha
  end

  private def normalize_fecha
    # Si no se envio fecha, asignar el momento actual local
    if fecha.value.nil?
      fecha.value = Time.local
      return
    end

    fecha.value.try do |f|
      # Si la hora viene en medianoche (00:00:00) debido al formato YYYY-MM-DD del datepicker,
      # lo fijamos en la zona horaria local con la hora actual para garantizar que pertenezca al dia seleccionado
      if f.hour == 0 && f.minute == 0 && f.second == 0
        now_local = Time.local
        fecha.value = Time.local(f.year, f.month, f.day, now_local.hour, now_local.minute, now_local.second, location: Time::Location.local)
      end
    end
  end
end
