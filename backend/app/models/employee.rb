class Employee < ApplicationRecord
  validates :first_name, :last_name, :job_title, :country, :salary, :email, presence: true
  validates :salary, numericality: { greater_than_or_equal_to: 0 }
  validates :email, uniqueness: true

  VALID_EMAIL_REGEX = URI::MailTo::EMAIL_REGEXP
  validates :email, format: { with: VALID_EMAIL_REGEX }

  def full_name
    "#{first_name} #{last_name}"
  end
end
