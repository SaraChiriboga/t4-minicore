class Api::Regla::Delete < ApiAction
  before require_admin

  delete "/api/regla/:regla_id" do
    ReglaQuery.find(regla_id).delete
    json({ message: "Regla eliminada correctamente" })
  end
end
