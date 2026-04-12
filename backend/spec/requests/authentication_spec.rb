require "rails_helper"

RSpec.describe "Authentication API", type: :request do
  let!(:user) do
    create(
      :user,
      email: "demo@example.com",
      username: "demo_user",
      password: "Password@123",
      password_confirmation: "Password@123",
      employee_id: "EMP-1001"
    )
  end

  def json
    JSON.parse(response.body)
  end

  describe "POST /login" do
    it "logs in with email and password" do
      post "/login", params: {
        user: {
          email: user.email,
          password: "Password@123"
        }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to start_with("Bearer ")
      expect(json.dig("user", "email")).to eq(user.email)
    end

    it "rejects username login" do
      post "/login", params: {
        user: {
          email: user.username,
          password: "Password@123"
        }
      }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects invalid credentials" do
      post "/login", params: {
        user: {
          email: user.email,
          password: "wrong-password"
        }
      }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
