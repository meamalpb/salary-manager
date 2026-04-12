first_names_path = Rails.root.join("db/seeds/first_names.txt")
last_names_path = Rails.root.join("db/seeds/last_names.txt")

unless File.exist?(first_names_path) && File.exist?(last_names_path)
  abort <<~MESSAGE
    Missing seed name files.
    Run `bin/rake employees:generate_name_files` before `bin/rails db:seed`.
  MESSAGE
end

first_names = File.readlines(first_names_path, chomp: true).map(&:strip).reject(&:empty?).uniq
last_names = File.readlines(last_names_path, chomp: true).map(&:strip).reject(&:empty?).uniq

abort "Expected at least 100 first names and 100 last names in db/seeds/*.txt" if first_names.size < 100 || last_names.size < 100

job_titles = [
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
].freeze

countries = [
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
].freeze

timestamp = Time.current
random = Random.new(10_000)

employees = first_names.first(100).product(last_names.first(100)).each_with_index.map do |(first_name, last_name), index|
  slug = "#{first_name.parameterize(separator: '_')}.#{last_name.parameterize(separator: '_')}"

  {
    first_name: first_name,
    last_name: last_name,
    country: countries.sample(random: random),
    job_title: job_titles.sample(random: random),
    salary: random.rand(35_000.0..180_000.0).round(2),
    email: "#{slug}_#{index + 1}@company.com",
    created_at: timestamp,
    updated_at: timestamp
  }
end

Employee.delete_all

employees.each_slice(1_000) do |batch|
  # rubocop:disable Rails/SkipsModelValidations:
  Employee.insert_all!(batch)
  # rubocop:enable Rails/SkipsModelValidations:
end

Rails.logger.debug "Seeded #{employees.size} employees"
