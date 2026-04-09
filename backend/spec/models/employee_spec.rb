require 'rails_helper'

RSpec.describe Employee, type: :model do
  subject { build(:employee) }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is invalid without a first_name" do
    subject.first_name = nil
    expect(subject).not_to be_valid
  end

  it "is invalid with negative salary" do
    subject.salary = -100
    expect(subject).not_to be_valid
  end

  it "is invalid with duplicate email" do
    create(:employee, email: "test@example.com")
    subject.email = "test@example.com"
    expect(subject).not_to be_valid
  end

  it "is invalid with incorrect email format" do
    subject.email = "invalid_email"
    expect(subject).not_to be_valid
  end
end
