class EmployeesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_employee, only: %i[show update destroy]

  def index
    employees = Employee.all
    render json: EmployeeSerializer.serialize_collection(employees), status: :ok
  end

  def summary
    render json: {
      total_employees: Employee.count,
      monthly_payroll: Employee.sum(:salary).to_f
    }, status: :ok
  end

  def show
    render json: EmployeeSerializer.new(@employee).as_json, status: :ok
  end

  def create
    employee = Employee.new(employee_params)

    if employee.save
      render json: EmployeeSerializer.new(employee).as_json, status: :created
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    if @employee.update(employee_params)
      render json: EmployeeSerializer.new(@employee).as_json, status: :ok
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    @employee.destroy
    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:id])
  end

  def employee_params
    params.require(:employee).permit(
      :first_name,
      :last_name,
      :job_title,
      :country,
      :salary,
      :email,
      :mobile_number
    )
  end
end
