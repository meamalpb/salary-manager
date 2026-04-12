User.find_or_create_by!(email: "demo@example.com") do |user|
  user.username = "demo_user"
  user.password = "Password@123"
  user.password_confirmation = "Password@123"
  user.employee_id = 1
end

load Rails.root.join("db/seeds/employees.rb")
