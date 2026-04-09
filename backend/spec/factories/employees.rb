FactoryBot.define do
  factory :employee do
    first_name { Faker::Name.first_name }
    last_name  { Faker::Name.last_name }
    job_title  { Faker::Job.title }
    country    { Faker::Address.country }
    salary     { Faker::Number.decimal(l_digits: 5, r_digits: 2) }
    email      { Faker::Internet.unique.email }
    mobile_number { Faker::PhoneNumber.cell_phone }
  end
end
