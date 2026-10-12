class Api::Regla::Show < ApiAction
  before require_admin

  get "/api/regla/:regla_id" do
    regla = ReglaQuery.find(regla_id)
    json ReglaSerializer.new(regla)
  end
end
