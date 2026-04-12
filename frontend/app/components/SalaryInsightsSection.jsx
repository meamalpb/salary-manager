import InsightResultCard from "./InsightResultCard";

export default function SalaryInsightsSection({
  countries,
  jobTitles,
  formValues,
  isPending,
  error,
  countryStats,
  jobTitleStats,
  onInputChange,
  onRunCountryInsights,
  onRunJobTitleInsights,
}) {
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
          <form className="insight-form" onSubmit={onRunCountryInsights}>
            <div className="insight-form-head">
              <h3 className="insight-form-title">Country salary range</h3>
              <p className="panel-sub">
                Fetch the minimum, average, and maximum salary for a single
                country.
              </p>
            </div>

            <label className="field">
              <span className="field-label">Country</span>
              <input
                list="country-options"
                name="country"
                value={formValues.country}
                onChange={onInputChange}
                placeholder="India"
                required
              />
            </label>

            <button className="btn-primary" type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Run country insights"}
            </button>
          </form>

          <form className="insight-form" onSubmit={onRunJobTitleInsights}>
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
                <input
                  list="country-options"
                  name="country"
                  value={formValues.country}
                  onChange={onInputChange}
                  placeholder="India"
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">Job title</span>
                <input
                  list="job-title-options"
                  name="job_title"
                  value={formValues.job_title}
                  onChange={onInputChange}
                  placeholder="Engineer"
                  required
                />
              </label>
            </div>

            <button className="btn-primary" type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Run role insights"}
            </button>
          </form>
        </div>

        <datalist id="country-options">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>

        <datalist id="job-title-options">
          {jobTitles.map((jobTitle) => (
            <option key={jobTitle} value={jobTitle} />
          ))}
        </datalist>
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
