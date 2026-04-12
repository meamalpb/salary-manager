require 'rails_helper'

RSpec.describe "Employees API", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers_for(user) }
  let!(:employees) do
    [
      create(:employee, first_name: "John",  last_name: "Doe",   email: "john@example.com",  job_title: "Engineer", country: "USA"),
      create(:employee, first_name: "Mark",  last_name: "Smith", email: "mark@example.com",  job_title: "Manager",  country: "UK"),
      create(:employee, first_name: "Steve", last_name: "Brown", email: "steve@example.com", job_title: "Designer", country: "Canada")
    ]
  end
  let(:employee_id) { employees.first.id }

  def json
    JSON.parse(response.body)
  end

  describe "GET /employees" do
    it "returns all employees" do
      get "/employees", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(3)
    end

    it "filters employees when the query has at least three characters" do
      matching_employee = create(
        :employee,
        first_name: "Alicia",
        last_name: "Stone",
        email: "alicia@example.com",
        job_title: "Backend Engineer",
        country: "India"
      )
      create(
        :employee,
        first_name: "Brian",
        last_name: "Cole",
        email: "brian@example.com",
        job_title: "Designer",
        country: "Canada"
      )

      get "/employees", params: { q: "ali" }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(json.map { |employee| employee["id"] }).to eq([matching_employee.id])
    end

    it "does not filter employees for short queries" do
      get "/employees", params: { q: "al" }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(3)
    end
  end

  describe "GET /employees/summary" do
    it "returns aggregated employee totals" do
      get "/employees/summary", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json).to include(
        "total_employees" => 3,
        "monthly_payroll" => Employee.sum(:salary).to_f
      )
    end

    it "rejects unauthenticated access" do
      get "/employees/summary"

      expect(response).to have_http_status(:unauthorized)
      expect(json["error"]).to be_present
    end
  end

  describe "GET /employees/:id" do
    it "returns the employee" do
      get "/employees/#{employee_id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json["id"]).to eq(employee_id)
    end

    it "returns 404 if employee not found" do
      get "/employees/0", headers: headers

      expect(response).to have_http_status(:not_found)
      expect(json["error"]).to be_present
    end
  end

  describe "POST /employees" do
    let(:valid_params) do
      {
        employee: {
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          job_title: Faker::Job.title,
          country: Faker::Address.country,
          salary: Faker::Number.decimal(l_digits: 5, r_digits: 2),
          email: Faker::Internet.unique.email,
          mobile_number: Faker::PhoneNumber.cell_phone
        }
      }
    end

    it "creates an employee" do
      expect do
        post "/employees", params: valid_params, headers: headers
      end.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns errors for invalid data" do
      post "/employees", params: { employee: { first_name: "" } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      expect(json["errors"]).to be_present
    end
  end

  describe "PUT /employees/:id" do
    let(:update_params) do
      {
        employee: {
          first_name: Faker::Name.first_name
        }
      }
    end

    it "updates the employee" do
      put "/employees/#{employee_id}", params: update_params, headers: headers

      expect(response).to have_http_status(:ok)
      expect(Employee.find(employee_id).first_name).to eq(update_params[:employee][:first_name])
    end
  end

  describe "DELETE /employees/:id" do
    it "deletes the employee" do
      expect do
        delete "/employees/#{employee_id}", headers: headers
      end.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "rejects unauthenticated access" do
      delete "/employees/#{employee_id}"

      expect(response).to have_http_status(:unauthorized)
      expect(json["error"]).to be_present
    end
  end
end
