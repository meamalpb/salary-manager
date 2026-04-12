import { useEffect, useState } from "react";

export default function EmployeeForm({
  editingEmployeeId,
  formValues,
  isPending,
  onSubmit,
  onReset,
  onSwitchToAdd,
}) {
  const [draftValues, setDraftValues] = useState(formValues);

  useEffect(() => {
    setDraftValues(formValues);
  }, [formValues]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setDraftValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(draftValues);
  }

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

      <form className="emp-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="field-row">
          <Field label="First name">
            <input
              name="first_name"
              value={draftValues.first_name}
              onChange={handleInputChange}
              placeholder="Aarav"
              autoComplete="off"
              required
            />
          </Field>
          <Field label="Last name">
            <input
              name="last_name"
              value={draftValues.last_name}
              onChange={handleInputChange}
              placeholder="Sharma"
              autoComplete="off"
              required
            />
          </Field>
        </div>

        <div className="field-row">
          <Field label="Email">
            <input
              name="email"
              type="email"
              value={draftValues.email}
              onChange={handleInputChange}
              placeholder="aarav@example.com"
              autoComplete="off"
              required
            />
          </Field>
          <Field label="Mobile number">
            <input
              name="mobile_number"
              value={draftValues.mobile_number}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="field-row">
          <Field label="Job title">
            <input
              name="job_title"
              value={draftValues.job_title}
              onChange={handleInputChange}
              placeholder="Software Engineer"
              autoComplete="off"
              required
            />
          </Field>
          <Field label="Country">
            <input
              name="country"
              value={draftValues.country}
              onChange={handleInputChange}
              placeholder="India"
              autoComplete="off"
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
            value={draftValues.salary}
            onChange={handleInputChange}
            placeholder="50000"
            autoComplete="off"
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
