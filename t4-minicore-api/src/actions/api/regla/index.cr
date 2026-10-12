class Api::Regla::Index < ApiAction
  before require_admin

  get "/api/regla" do
    reglas = ReglaQuery.new.monto_minimo.asc_order
    json ReglaSerializer.for_collection(reglas)
  end
end
