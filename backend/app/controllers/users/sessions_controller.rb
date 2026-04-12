module Users
  class SessionsController < Devise::SessionsController
    respond_to :json

    private

    def respond_with(current_user, _opts = {})
      render json: {
        message: "Logged in successfully.",
        user: current_user.as_json(only: %i[id email username employee_id])
      }, status: :ok
    end

    def respond_to_on_destroy
      return render json: { message: "Logged out successfully." }, status: :ok if current_user

      render json: { message: "No active session found." }, status: :unauthorized
    end
  end
end
