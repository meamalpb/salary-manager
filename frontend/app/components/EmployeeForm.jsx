export default function EmployeeForm({
  editingEmployeeId,
  formValues,
  isPending,
  onInputChange,
  onSubmit,
  onReset,
  onSwitchToAdd,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            {editingEmployeeId ? "Edit employee" : "Add employee"}
          </h2>
          <p className="panel-sub">
            {editingEmployeeId
              ? "Make changes and save to update the record."
              : "Fill in the details to create a new employee record."}
          </p>
        </div>
        {editingEmployeeId && (
          <button className="link-btn" onClick={onSwitchToAdd} type="button">
            ← Add new instead
          </button>
        )}
      </div>

      <form className="emp-form" onSubmit={onSubmit}>
        <div className="field-row">
          <Field label="First name">
            <input
              name="first_name"
              value={formValues.first_name}
              onChange={onInputChange}
              placeholder="Aarav"
              required
            />
          </Field>
          <Field label="Last name">
            <input
              name="last_name"
              value={formValues.last_name}
              onChange={onInputChange}
              placeholder="Sharma"
              required
            />
          </Field>
        </div>

        <div className="field-row">
          <Field label="Email">
            <input
              name="email"
              type="email"
              value={formValues.email}
              onChange={onInputChange}
              placeholder="aarav@example.com"
              required
            />
          </Field>
          <Field label="Mobile number">
            <input
              name="mobile_number"
              value={formValues.mobile_number}
              onChange={onInputChange}
              placeholder="+91 98765 43210"
            />
          </Field>
        </div>

        <div className="field-row">
          <Field label="Job title">
            <input
              name="job_title"
              value={formValues.job_title}
              onChange={onInputChange}
              placeholder="Software Engineer"
              required
            />
          </Field>
          <Field label="Country">
            <input
              name="country"
              value={formValues.country}
              onChange={onInputChange}
              placeholder="India"
              required
            />
          </Field>
        </div>

        <Field label="Salary (USD)">
          <input
            name="salary"
            type="number"
            min="0"
            step="0.01"
            value={formValues.salary}
            onChange={onInputChange}
            placeholder="50000"
            required
          />
        </Field>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onReset} disabled={isPending}>
            Clear
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending
              ? "Saving…"
              : editingEmployeeId
              ? "Update employee"
              : "Add employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
