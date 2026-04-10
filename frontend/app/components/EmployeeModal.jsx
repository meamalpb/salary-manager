import { formatCurrency, formatTimestamp } from "../lib/formatters";

export default function EmployeeModal({ employee, onClose, onEdit }) {
  if (!employee) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-name">{employee.full_name}</h3>
            <p className="modal-sub">Employee #{employee.id} · Full record</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="detail-grid">
          <DetailItem label="Job title" value={employee.job_title} />
          <DetailItem label="Country" value={employee.country} />
          <DetailItem label="Salary" value={formatCurrency(employee.salary)} highlight />
          <DetailItem label="Mobile" value={employee.mobile_number || "Not provided"} />
          <DetailItem label="Email" value={employee.email} wide />
          <DetailItem label="Last updated" value={formatTimestamp(employee.updated_at)} />
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={() => { onEdit(employee); onClose(); }}>
            Edit employee
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, highlight, wide }) {
  return (
    <div className={`detail-item${wide ? " wide" : ""}`}>
      <div className="detail-label">{label}</div>
      <div className={`detail-value${highlight ? " highlight" : ""}`}>{value}</div>
    </div>
  );
}
