class Api::Ventas::Index < ApiAction
  before require_admin_or_vendedor

  param fecha_inicio : String? = nil
  param fecha_fin : String? = nil

  get "/api/ventas" do
    base_query = VentaQuery.new.preload_vendedor

    if current_user.role.regular?
      vid = current_user_vendedor_id
      base_query = base_query.vendedor_id(vid)
    elsif param_vendedor_id = params.get?("vendedor_id")
      if vid = param_vendedor_id.to_i64?
        base_query = base_query.vendedor_id(vid)
      end
    end

    if fecha_inicio || fecha_fin || params.get?("reporte") == "true"
      query = base_query

      if f_ini = fecha_inicio
        unless f_ini.blank?
          if parsed_ini = (Time.parse(f_ini, "%Y-%m-%d", Time::Location.local) rescue nil) || (Time.parse_iso8601(f_ini) rescue nil)
            query = query.fecha.gte(parsed_ini.at_beginning_of_day)
          end
        end
      end

      if f_fin = fecha_fin
        unless f_fin.blank?
          if parsed_fin = (Time.parse(f_fin, "%Y-%m-%d", Time::Location.local) rescue nil) || (Time.parse_iso8601(f_fin) rescue nil)
            query = query.fecha.lte(parsed_fin.at_end_of_day)
          end
        end
      end

      ventas = query.results
      reglas = ReglaQuery.new.monto_minimo.desc_order.results

      vendedores_ventas = ventas.group_by(&.vendedor)
      reporte = vendedores_ventas.map do |vendedor, lista_ventas|
        total = lista_ventas.sum(&.monto)
        regla_aplicada = reglas.find { |r| total >= r.monto_minimo }
        pct = regla_aplicada ? regla_aplicada.porcentaje_comision : 0.0
        comision = total * (pct / 100.0)

        ComisionSerializer.new(vendedor, total, pct, comision)
      end

      json reporte
    else
      json VentaSerializer.for_collection(base_query)
    end
  end
end
