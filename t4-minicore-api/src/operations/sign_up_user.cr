class SignUpUser < User::SaveOperation
  param_key :user
  include PasswordValidations

  permit_columns email, name, last_name, phone, vendedor_id
  attribute password : String
  attribute password_confirmation : String

  before_save do
    validate_uniqueness_of email
    Authentic.copy_and_encrypt(password, to: encrypted_password) if password.valid?
    role.value = User::Role::Regular unless role.value
  end
end
