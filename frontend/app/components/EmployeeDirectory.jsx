import { formatCurrency } from "../lib/formatters";

export default function EmployeeDirectory({
  employees,
  isLoading,
  searchTerm,
  onSearchChange,
  page,
  perPage,
  totalPages,
  totalCount,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

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
      {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
        <p className="panel-sub">Type at least 3 characters to search.</p>
      )}

      <div className="pagination-bar">
        <div className="pagination-summary">
          Showing <strong>{employees.length}</strong> of{" "}
          <strong>{Number.isFinite(totalCount) ? totalCount : employees.length}</strong>
          {Number.isFinite(perPage) ? ` · ${perPage}/page` : ""}
        </div>
        <div className="pagination-controls">
          <button
            type="button"
            className="btn-ghost pagination-btn"
            disabled={isLoading || safePage <= 1}
            onClick={() => onPageChange?.(safePage - 1)}
          >
            Prev
          </button>
          <span className="pagination-pill" aria-live="polite">
            Page {safePage} / {safeTotalPages}
          </span>
          <button
            type="button"
            className="btn-ghost pagination-btn"
            disabled={isLoading || safePage >= safeTotalPages}
            onClick={() => onPageChange?.(safePage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="table-wrap" style={{ height: '400px', overflowY: 'auto' }}>
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
