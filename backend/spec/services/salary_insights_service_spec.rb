require 'rails_helper'

RSpec.describe SalaryInsightsService do
  describe "#country_stats" do
    it "returns min, max and avg salary" do
      create(:employee, country: "India", salary: 1000)
      create(:employee, country: "India", salary: 3000)

      result = described_class.new.country_stats("India")

      expect(result[:min_salary]).to eq(1000)
      expect(result[:max_salary]).to eq(3000)
      expect(result[:avg_salary]).to eq(2000.0)
    end
  end

  describe "#job_title_stats" do
    it "returns avg salary for job title in a country" do
      create(:employee, country: "India", job_title: "Engineer", salary: 1000)
      create(:employee, country: "India", job_title: "Engineer", salary: 3000)

      result = described_class.new.job_title_stats(
        country: "India",
        job_title: "Engineer"
      )

      expect(result[:avg_salary]).to eq(2000.0)
    end
  end
end
