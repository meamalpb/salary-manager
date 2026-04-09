require 'rails_helper'

RSpec.describe "SalaryInsights API", type: :request do
  describe "GET /salary_insights/country_stats" do
    it "returns min, max and avg salary for a country", :aggregate_failures do
      create(:employee, country: "India", salary: 1000)
      create(:employee, country: "India", salary: 3000)

      get "/salary_insights/country_stats", params: { country: "India" }

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["country"]).to eq("India")
      expect(json["min_salary"]).to eq("1000.0")
      expect(json["max_salary"]).to eq("3000.0")
      expect(json["avg_salary"]).to eq(2000.0)
    end
  end

  describe "GET /salary_insights/job_title_stats" do
    it "returns avg salary for a job title in a country", :aggregate_failures do
      create(:employee, country: "India", job_title: "Engineer", salary: 2000)
      create(:employee, country: "India", job_title: "Engineer", salary: 4000)

      get "/salary_insights/job_title_stats",
          params: { country: "India", job_title: "Engineer" }

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["country"]).to eq("India")
      expect(json["job_title"]).to eq("Engineer")
      expect(json["avg_salary"]).to eq(3000.0)
    end
  end
end
