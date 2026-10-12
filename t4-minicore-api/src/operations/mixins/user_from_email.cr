module UserFromEmail
  private def user_from_email : User?
    email.value.try do |value|
      clean_email = value.strip
      UserQuery.new.email(clean_email).first?
    end
  end
end
