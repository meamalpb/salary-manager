FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:username) { |n| "demo_user_#{n}" }
    password { "Password@123" }
    password_confirmation { password }
    sequence(:employee_id) { |n| "EMP-#{n}" }
  end
end
