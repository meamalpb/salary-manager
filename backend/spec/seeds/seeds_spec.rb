require "rails_helper"

# rubocop:disable RSpec/DescribeClass
RSpec.describe "db:seed" do
  around do |example|
    User.delete_all
    Employee.delete_all

    example.run
  ensure
    User.delete_all
    Employee.delete_all
  end

  let(:job_titles) do
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
    ]
  end

  let(:countries) do
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
    ]
  end

  it "creates employees with consistent seed data" do
    load Rails.root.join("db/seeds.rb")

    employees = Employee.order(:id).to_a
    seeded_timestamp = employees.first&.created_at

    aggregate_failures do
      expect(employees.size).to eq(10_000)
      expect(employees.map(&:email)).to match_array(employees.map(&:email).uniq)
      expect(employees).to all(have_attributes(created_at: seeded_timestamp, updated_at: seeded_timestamp))
      expect(employees).to all(satisfy("have valid attributes") do |employee|
        employee.first_name.present? &&
          employee.last_name.present? &&
          job_titles.include?(employee.job_title) &&
          countries.include?(employee.country) &&
          employee.salary.to_d >= 35_000 &&
          employee.salary.to_d <= 180_000 &&
          employee.email.match?(/\A[a-z0-9_]+\.[a-z0-9_]+_\d+@company\.com\z/) &&
          employee.valid?
      end)
    end
  end
end
# rubocop:enable RSpec/DescribeClass
