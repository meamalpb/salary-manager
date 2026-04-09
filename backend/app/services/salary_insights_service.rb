class SalaryInsightsService
  def initialize(scope = Employee.all)
    @scope = scope
  end

  def country_stats(country)
    employees = @scope.where(country: country)

    return empty_country_response(country) if employees.empty?

    {
      country: country,
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: avg(employees)
    }
  end

  # b) Avg salary for given job title in a country
  def job_title_stats(country:, job_title:)
    employees = @scope.where(country: country, job_title: job_title)

    return empty_job_title_response(country, job_title) if employees.empty?

    {
      country: country,
      job_title: job_title,
      avg_salary: avg(employees)
    }
  end

  private

  def avg(relation)
    relation.average(:salary)&.to_f&.round(2)
  end

  def empty_country_response(country)
    {
      country: country,
      min_salary: nil,
      max_salary: nil,
      avg_salary: nil
    }
  end

  def empty_job_title_response(country, job_title)
    {
      country: country,
      job_title: job_title,
      avg_salary: nil
    }
  end
end
