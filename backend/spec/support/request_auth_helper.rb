module RequestAuthHelper
  def auth_headers_for(user)
    token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

    {
      "Authorization" => "Bearer #{token}",
      "Accept" => "application/json"
    }
  end
end
