FactoryBot.define do
  factory :employee do
    first_name { Faker::Name.first_name }
    last_name  { Faker::Name.last_name }
    job_title  do
      [
        "Software Engineer",
        "Senior Software Engineer",
        "Engineering Manager",
        "QA Engineer",
        "Product Manager",
        "HR Manager",
        "Data Analyst",
        "Finance Analyst",
        "DevOps Engineer",
        "Support Specialist"
      ].sample
    end
    country do
      [
        "India",
        "United States",
        "Canada",
        "Germany",
        "United Kingdom",
        "Australia",
        "Singapore",
        "Netherlands",
        "Brazil",
        "Japan"
      ].sample
    end
    salary     { Faker::Number.decimal(l_digits: 5, r_digits: 2) }
    email      { Faker::Internet.unique.email }
    mobile_number { Faker::PhoneNumber.cell_phone }
  end
end
