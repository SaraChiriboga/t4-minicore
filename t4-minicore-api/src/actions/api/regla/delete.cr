class Api::Regla::Delete < ApiAction
  before require_admin

  delete "/api/regla/:regla_id" do
    regla = ReglaQuery.new.id(regla_id).first?
    if regla
      regla.delete
      json({ message: "Regla eliminada correctamente" })
    else
      json({ message: "Regla no encontrada" }, status: 404)
    end
  end
end
