class UpdateUser < User::SaveOperation
  permit_columns email, name, last_name, phone, vendedor_id
end