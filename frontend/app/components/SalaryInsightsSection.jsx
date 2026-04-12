import { useEffect, useState } from "react";
import InsightResultCard from "./InsightResultCard";

const JOB_TITLES = [
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
];

const COUNTRIES = [
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
];

export default function SalaryInsightsSection({
  countries,
  jobTitles,
  formValues,
  isPending,
  error,
  countryStats,
  jobTitleStats,
  onRunCountryInsights,
  onRunJobTitleInsights,
}) {
  const [countryFormValues, setCountryFormValues] = useState({ country: '' });
  const [jobTitleFormValues, setJobTitleFormValues] = useState({ country: '', job_title: '' });
  const [currentLoadingOperation, setCurrentLoadingOperation] = useState(null);

  function handleCountryInputChange(e) {
    const { name, value } = e.target;
    setCountryFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleJobTitleInputChange(e) {
    const { name, value } = e.target;
    setJobTitleFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleCountrySubmit(e) {
    e.preventDefault();
    setCurrentLoadingOperation('country');
    onRunCountryInsights(countryFormValues);
  }

  function handleJobTitleSubmit(e) {
    e.preventDefault();
    setCurrentLoadingOperation('jobTitle');
    onRunJobTitleInsights(jobTitleFormValues);
  }

  useEffect(() => {
    if (!isPending && currentLoadingOperation) {
      setCurrentLoadingOperation(null);
    }
  }, [isPending, currentLoadingOperation]);

  return (
    <section className="insights-layout">
      <div className="panel insights-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Salary insights</h2>
            <p className="panel-sub">
              Explore salary ranges by country and compare average pay for a role
              within a country.
            </p>
          </div>
        </div>

        {error ? <div className="alert-bar error">{error}</div> : null}

        <div className="insight-forms">
          <form
            className="insight-form"
            onSubmit={handleCountrySubmit}
            autoComplete="off"
          >
            <div className="insight-form-head">
              <h3 className="insight-form-title">Country salary range</h3>
              <p className="panel-sub">
                Fetch the minimum, average, and maximum salary for a single
                country.
              </p>
            </div>

            <label className="field">
              <span className="field-label">Country</span>
              <select
                name="country"
                value={countryFormValues.country}
                onChange={handleCountryInputChange}
                autoComplete="off"
                required
              >
                <option value="">Select country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </label>

            <button className="btn-primary" type="submit" disabled={isPending && currentLoadingOperation === 'country'}>
              {isPending && currentLoadingOperation === 'country' ? "Loading..." : "Run country insights"}
            </button>
          </form>

          <form
            className="insight-form"
            onSubmit={handleJobTitleSubmit}
            autoComplete="off"
          >
            <div className="insight-form-head">
              <h3 className="insight-form-title">Role average salary</h3>
              <p className="panel-sub">
                Check the average salary for a job title inside the selected
                country.
              </p>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Country</span>
                <select
                  name="country"
                  value={jobTitleFormValues.country}
                  onChange={handleJobTitleInputChange}
                  autoComplete="off"
                  required
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">Job title</span>
                <select
                  name="job_title"
                  value={jobTitleFormValues.job_title}
                  onChange={handleJobTitleInputChange}
                  autoComplete="off"
                  required
                >
                  <option value="">Select job title</option>
                  {JOB_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </label>
            </div>

            <button className="btn-primary" type="submit" disabled={isPending && currentLoadingOperation === 'jobTitle'}>
              {isPending && currentLoadingOperation === 'jobTitle' ? "Loading..." : "Run role insights"}
            </button>
          </form>
        </div>

      </div>

      <div className="insights-results">
        <InsightResultCard
          title="Country metrics"
          subtitle={
            formValues.country
              ? `Results for ${formValues.country}`
              : "Choose a country to inspect"
          }
          emptyMessage="Run a country query to see min, average, and max salary."
          stats={
            countryStats
              ? {
                  min_salary: countryStats.min_salary,
                  avg_salary: countryStats.avg_salary,
                  max_salary: countryStats.max_salary,
                }
              : null
          }
        />

        <InsightResultCard
          title="Role benchmark"
          subtitle={
            formValues.country && formValues.job_title
              ? `${formValues.job_title} in ${formValues.country}`
              : "Choose a country and job title"
          }
          emptyMessage="Run a role query to see the average salary benchmark."
          stats={
            jobTitleStats
              ? {
                  avg_salary: jobTitleStats.avg_salary,
                }
              : null
          }
        />
      </div>
    </section>
  );
}
