import { formatCurrency } from "../lib/formatters";

export default function EmployeeDirectory({
  employees,
  isLoading,
  searchTerm,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Employee directory</h2>
          <p className="panel-sub">
            Browse, search, and manage your team records.
          </p>
        </div>
        <input
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, role, country…"
        />
      </div>

      <div className="table-wrap">
        <table className="emp-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Country</th>
              <th>Salary</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <span className="spinner" />
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-name">{emp.full_name}</div>
                    <div className="emp-id">#{emp.id}</div>
                  </td>
                  <td>{emp.job_title}</td>
                  <td>{emp.country}</td>
                  <td className="salary-cell">{formatCurrency(emp.salary)}</td>
                  <td className="email-cell">{emp.email}</td>
                  <td>
                    <div className="row-actions">
                      <button className="act-view" onClick={() => onView(emp)}>View</button>
                      <button className="act-edit" onClick={() => onEdit(emp)}>Edit</button>
                      <button className="act-delete" onClick={() => onDelete(emp)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
