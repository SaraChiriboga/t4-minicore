class User < BaseModel
  include Carbon::Emailable
  include Authentic::PasswordAuthenticatable

  enum Role
    Regular
    Admin
  end

  table do
    column email : String
    column encrypted_password : String
    column role : User::Role

    column name : String
    column last_name : String
    column phone : String

    belongs_to vendedor : Vendedor?
  end

  def emailable : Carbon::Address
    Carbon::Address.new(email)
  end
end
