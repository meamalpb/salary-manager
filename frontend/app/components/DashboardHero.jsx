import { formatCurrency } from "../lib/formatters";

export default function DashboardHero({ employeeCount, totalPayroll, backendStatus }) {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <span className="badge-label">Employee dashboard</span>
        <h1>Manage your team,<br />effortlessly.</h1>
        <p className="hero-sub">
          Add, review, update, and remove employees from one clean interface.
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total employees</div>
          <div className="stat-value primary">{employeeCount}</div>
          <div className="stat-desc">Active records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly payroll</div>
          <div className="stat-value secondary">{formatCurrency(totalPayroll)}</div>
          <div className="stat-desc">Based on listed salaries</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">API status</div>
          <div className={`stat-value ${backendStatus.ok ? "success" : "warning"}`}>
            {backendStatus.ok ? "● Live" : "○ Down"}
          </div>
          <div className="stat-desc">HTTP {backendStatus.status}</div>
        </div>
      </div>
    </section>
  );
}
