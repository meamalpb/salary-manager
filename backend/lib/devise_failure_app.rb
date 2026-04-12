class DeviseFailureApp < Devise::FailureApp
  def respond
    json_api_error
  end

  private

  def json_api_error
    self.status = :unauthorized
    self.content_type = "application/json"
    self.response_body = {
      error: i18n_message
    }.to_json
  end
end
