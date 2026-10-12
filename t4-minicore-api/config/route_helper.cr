# This is used when generating URLs for your application
Lucky::RouteHelper.configure do |settings|
  if LuckyEnv.production?
    # Example: https://my_app.com
    settings.base_uri = ENV["APP_DOMAIN"]? || ENV["RENDER_EXTERNAL_URL"]? || "http://localhost:#{Lucky::ServerSettings.port}"
  else
    # Set domain to the default host/port in development/test
    settings.base_uri = "http://localhost:#{Lucky::ServerSettings.port}"
  end
end
