import { formatCurrency } from "../lib/formatters";

function displayValue(value) {
  return value == null ? "N/A" : formatCurrency(value);
}

export default function InsightResultCard({ title, subtitle, emptyMessage, stats }) {
  const hasData = stats && Object.values(stats).some((value) => value != null);

  return (
    <div className="insight-card">
      <div className="insight-card-header">
        <div>
          <h3 className="insight-title">{title}</h3>
          <p className="insight-sub">{subtitle}</p>
        </div>
        <span className={`insight-pill ${hasData ? "filled" : "empty"}`}>
          {hasData ? "Data ready" : "Waiting"}
        </span>
      </div>

      {hasData ? (
        <div className="insight-stats">
          {Object.entries(stats).map(([label, value]) => (
            <div className="insight-stat" key={label}>
              <div className="insight-stat-label">{label.replaceAll("_", " ")}</div>
              <div className="insight-stat-value">{displayValue(value)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="insight-empty">{emptyMessage}</div>
      )}
    </div>
  );
}
