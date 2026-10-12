class Api::Regla::Update < ApiAction
  before require_admin

  put "/api/regla/:regla_id" do
    regla = ReglaQuery.find(regla_id)
    SaveRegla.update(regla, params) do |operation, updated_regla|
      if updated_regla
        json ReglaSerializer.new(updated_regla), status: 200
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end
