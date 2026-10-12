class Api::Regla::Create < ApiAction
  before require_admin

  post "/api/regla" do
    SaveRegla.create(params) do |operation, regla|
      if regla
        json ReglaSerializer.new(regla), status: 201
      else
        raise Avram::InvalidOperationError.new(operation)
      end
    end
  end
end
