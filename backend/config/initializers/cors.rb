# Be sure to restart your server when you modify this file.

allowed_origins = ENV.fetch("ALLOWED_ORIGINS", "").split(",").map(&:strip).reject(&:empty?)

if allowed_origins.empty? && Rails.env.development?
  allowed_origins = %w[
    http://localhost:3001
    http://127.0.0.1:3001
  ]
end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "*",
             headers: :any,
             methods: %i[get post put patch delete options head]
  end
end
