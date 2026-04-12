class Employee < ApplicationRecord
  validates :first_name, :last_name, :job_title, :country, :salary, :email, presence: true
  validates :salary, numericality: { greater_than_or_equal_to: 0 }
  validates :email, uniqueness: true

  VALID_EMAIL_REGEX = URI::MailTo::EMAIL_REGEXP
  validates :email, format: { with: VALID_EMAIL_REGEX }

  scope :search, lambda { |term|
    query = "%#{sanitize_sql_like(term.downcase)}%"

    where(
      "LOWER(first_name) LIKE :query OR LOWER(last_name)
      LIKE :query OR LOWER(email) LIKE :query OR LOWER(job_title)
      LIKE :query OR LOWER(country) LIKE :query OR LOWER(first_name || ' ' || last_name)
      LIKE :query",
      query: query
    )
  }

  def full_name
    "#{first_name} #{last_name}"
  end
end
