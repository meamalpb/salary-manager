require 'rails_helper'

RSpec.describe Employee, type: :model do
  subject(:employee) { build(:employee) }

  it "is valid with valid attributes" do
    expect(employee).to be_valid
  end

  it "is invalid without a first_name" do
    employee.first_name = nil
    expect(employee).not_to be_valid
  end

  it "is invalid with negative salary" do
    employee.salary = -100
    expect(employee).not_to be_valid
  end

  it "is invalid with duplicate email" do
    create(:employee, email: "test@example.com")
    employee.email = "test@example.com"
    expect(employee).not_to be_valid
  end

  it "is invalid with incorrect email format" do
    employee.email = "invalid_email"
    expect(employee).not_to be_valid
  end
end
