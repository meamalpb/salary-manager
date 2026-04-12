Devise.setup do |config|
  config.mailer_sender = ENV.fetch("DEVISE_MAILER_SENDER", "please-change-me@example.com")

  require "devise/orm/active_record"

  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth, :params_auth]
  config.navigational_formats = []
  config.warden do |manager|
    manager.failure_app = DeviseFailureApp
  end

  jwt_secret = ENV["DEVISE_JWT_SECRET_KEY"].presence || Rails.application.secret_key_base

  config.jwt do |jwt|
    jwt.secret = jwt_secret
    jwt.dispatch_requests = [
      ["POST", %r{\A/login\z}]
    ]
    jwt.revocation_requests = [
      ["DELETE", %r{\A/logout\z}]
    ]
    jwt.request_formats = {
      user: [:json]
    }
  end
end
