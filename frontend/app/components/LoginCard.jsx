export default function LoginCard({
  credentials,
  authError,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="badge-label">Demo access</span>
          <h1>Sign in to Salary Manager</h1>
        </div>

        {authError ? <div className="alert-bar error">{authError}</div> : null}

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              name="email"
              type="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="demo@example.com"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              name="password"
              type="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Password@123"
              required
            />
          </label>

          <button className="btn-primary auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-hint">
          Demo credentials: <strong>demo@example.com</strong> / <strong>Password@123</strong>
        </div>
      </section>
    </main>
  );
}
