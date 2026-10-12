require "carbon_sendgrid_adapter"

BaseEmail.configure do |settings|
  if LuckyEnv.production?
    key = ENV["SEND_GRID_KEY"]? || "unused"
    if key == "unused"
      settings.adapter = Carbon::DevAdapter.new
    else
      settings.adapter = Carbon::SendGridAdapter.new(api_key: key)
    end
  elsif LuckyEnv.development?
    settings.adapter = Carbon::DevAdapter.new(print_emails: true)
  else
    settings.adapter = Carbon::DevAdapter.new
  end
end
