class EmployeeSerializer
  def self.serialize_collection(employees)
    employees.map { |e| new(e).as_json }
  end

  def initialize(employee)
    @employee = employee
  end

  def as_json(*)
    {
      id: @employee.id,
      first_name: @employee.first_name,
      last_name: @employee.last_name,
      full_name: @employee.full_name,
      job_title: @employee.job_title,
      country: @employee.country,
      salary: @employee.salary,
      email: @employee.email,
      mobile_number: @employee.mobile_number,
      created_at: @employee.created_at,
      updated_at: @employee.updated_at
    }
  end
end
