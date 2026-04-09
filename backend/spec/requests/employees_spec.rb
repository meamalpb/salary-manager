require 'rails_helper'

RSpec.describe "Employees API", type: :request do
  let!(:employees) { create_list(:employee, 3) }
  let(:employee_id) { employees.first.id }

  def json
    JSON.parse(response.body)
  end

  describe "GET /employees" do
    it "returns all employees" do
      get "/employees"

      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(3)
    end
  end

  describe "GET /employees/:id" do
    it "returns the employee" do
      get "/employees/#{employee_id}"

      expect(response).to have_http_status(:ok)
      expect(json["id"]).to eq(employee_id)
    end

    it "returns 404 if employee not found" do
      get "/employees/0"

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
        post "/employees", params: valid_params
      end.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns errors for invalid data" do
      post "/employees", params: { employee: { first_name: "" } }

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
      put "/employees/#{employee_id}", params: update_params

      expect(response).to have_http_status(:ok)
      expect(Employee.find(employee_id).first_name).to eq(update_params[:employee][:first_name])
    end
  end

  describe "DELETE /employees/:id" do
    it "deletes the employee" do
      expect do
        delete "/employees/#{employee_id}"
      end.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
