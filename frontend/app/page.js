"use client";

import { useEffect, useEffectEvent, useMemo, useState, useTransition } from "react";
import DashboardHero from "./components/DashboardHero";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeDirectory from "./components/EmployeeDirectory";
import EmployeeModal from "./components/EmployeeModal";
import LoginCard from "./components/LoginCard";
import SalaryInsightsSection from "./components/SalaryInsightsSection";
import useSessionAuth from "./lib/useSessionAuth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000";

const emptyForm = {
  first_name: "", last_name: "", email: "",
  mobile_number: "", job_title: "", country: "", salary: "",
};
const emptySummary = { total_employees: 0, monthly_payroll: 0 };

async function parseResponse(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [directoryEmployees, setDirectoryEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [summary, setSummary] = useState(emptySummary);
  const [backendStatus, setBackendStatus] = useState({ ok: false, status: "checking" });
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [insightValues, setInsightValues] = useState({ country: "", job_title: "" });
  const [countryStats, setCountryStats] = useState(null);
  const [jobTitleStats, setJobTitleStats] = useState(null);
  const [insightsError, setInsightsError] = useState(null);
  const [isInsightsPending, startInsightsTransition] = useTransition();

  const {
    authStatus,
    authToken,
    currentUser,
    credentials,
    authError,
    isAuthSubmitting,
    handleCredentialsChange,
    handleLoginSubmit,
    handleLogout,
    handleUnauthorized,
  } = useSessionAuth({
    apiBaseUrl,
    onLoginSuccess: () => {
      setFeedback({ type: "success", message: "Signed in successfully." });
    },
    onUnauthorized: resetDashboardState,
    onLogout: () => {
      resetDashboardState();
    },
  });

  const bootstrapDashboard = useEffectEvent(async (token) => {
    setIsLoading(true);
    await Promise.all([checkBackendStatus(), loadEmployees(token), loadSummary(token)]);
    setIsLoading(false);
  });

  useEffect(() => {
    if (authStatus !== "authenticated" || !authToken) {
      setIsLoading(false);
      return;
    }

    bootstrapDashboard(authToken);
  }, [authStatus, authToken]);

  function resetDashboardState() {
    setEmployees([]);
    setDirectoryEmployees([]);
    setSelectedEmployee(null);
    setEditingEmployeeId(null);
    setFormValues(emptyForm);
    setSummary(emptySummary);
    setFeedback(null);
    setErrors([]);
    setSearchTerm("");
    setInsightValues({ country: "", job_title: "" });
    setCountryStats(null);
    setJobTitleStats(null);
    setInsightsError(null);
  }

  async function authenticatedFetch(path, options = {}, tokenOverride = authToken) {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(tokenOverride ? { Authorization: tokenOverride } : {}),
        ...(options.headers ?? {}),
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      handleUnauthorized();
    }

    return res;
  }

  const countries = useMemo(
    () => [...new Set(employees.map((employee) => employee.country).filter(Boolean))].sort(),
    [employees]
  );

  const jobTitles = useMemo(
    () => [...new Set(employees.map((employee) => employee.job_title).filter(Boolean))].sort(),
    [employees]
  );

  async function checkBackendStatus() {
    try {
      const res = await fetch(`${apiBaseUrl}/up`, { cache: "no-store" });
      setBackendStatus({ ok: res.ok, status: res.status });
    } catch (err) {
      setBackendStatus({ ok: false, status: "unreachable" });
    }
  }

  async function loadEmployees(tokenOverride = authToken) {
    try {
      const res = await authenticatedFetch("/employees", {}, tokenOverride);
      const data = await parseResponse(res);
      if (!res.ok) throw new Error("Unable to load employees.");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: "error", message: err.message ?? "Unable to load employees." });
    }
  }

  async function loadDirectoryEmployees(query = "", tokenOverride = authToken) {
    try {
      const trimmedQuery = query.trim();
      const params = new URLSearchParams();

      if (trimmedQuery.length >= 3) {
        params.set("q", trimmedQuery);
      }

      const path = params.size > 0 ? `/employees?${params.toString()}` : "/employees";
      const res = await authenticatedFetch(path, {}, tokenOverride);
      const data = await parseResponse(res);

      if (!res.ok) throw new Error("Unable to load employees.");
      setDirectoryEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: "error", message: err.message ?? "Unable to load employees." });
    }
  }

  useEffect(() => {
    if (authStatus !== "authenticated" || !authToken) return;

    const trimmedQuery = searchTerm.trim();
    if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
      setDirectoryEmployees(employees);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadDirectoryEmployees(trimmedQuery, authToken);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [authStatus, authToken, employees, searchTerm]);

  async function loadSummary(tokenOverride = authToken) {
    try {
      const res = await authenticatedFetch("/employees/summary", {}, tokenOverride);
      const data = await parseResponse(res);
      if (!res.ok) throw new Error("Unable to load employee summary.");
      setSummary({
        total_employees: Number(data?.total_employees ?? 0),
        monthly_payroll: Number(data?.monthly_payroll ?? 0),
      });
    } catch (err) {
      setFeedback((prev) => prev ?? {
        type: "error",
        message: err.message ?? "Unable to load employee summary.",
      });
    }
  }

  function resetForm() {
    setEditingEmployeeId(null);
    setFormValues(emptyForm);
    setErrors([]);
  }

  function openEditForm(employee) {
    setEditingEmployeeId(employee.id);
    setFormValues({
      first_name: employee.first_name ?? "",
      last_name: employee.last_name ?? "",
      email: employee.email ?? "",
      mobile_number: employee.mobile_number ?? "",
      job_title: employee.job_title ?? "",
      country: employee.country ?? "",
      salary: employee.salary?.toString() ?? "",
    });
    setErrors([]);
    setFeedback(null);
  }

  async function handleSubmit(nextFormValues) {
    setErrors([]);
    setFeedback(null);

    const method = editingEmployeeId ? "PUT" : "POST";
    startTransition(async () => {
      try {
        const res = await authenticatedFetch(editingEmployeeId ? `/employees/${editingEmployeeId}` : "/employees", {
          method,
          body: JSON.stringify({
            employee: {
              ...nextFormValues,
              salary: Number(nextFormValues.salary || 0),
            },
          }),
        });
        const data = await parseResponse(res);
        if (!res.ok) { setErrors(data?.errors ?? ["Unable to save employee."]); return; }
        setFeedback({ type: "success", message: editingEmployeeId ? "Employee updated." : "Employee added." });
        resetForm();
        await Promise.all([loadEmployees(), loadDirectoryEmployees(searchTerm), loadSummary(), checkBackendStatus()]);
      } catch (err) {
        setErrors([err.message ?? "Unable to save employee."]);
      }
    });
  }

  async function handleDelete(employee) {
    if (!window.confirm(`Delete ${employee.full_name}? This cannot be undone.`)) return;
    setFeedback(null);
    setErrors([]);

    startTransition(async () => {
      try {
        const res = await authenticatedFetch(`/employees/${employee.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Unable to delete employee.");
        if (selectedEmployee?.id === employee.id) setSelectedEmployee(null);
        if (editingEmployeeId === employee.id) resetForm();
        setFeedback({ type: "success", message: "Employee deleted." });
        await Promise.all([loadEmployees(), loadDirectoryEmployees(searchTerm), loadSummary(), checkBackendStatus()]);
      } catch (err) {
        setFeedback({ type: "error", message: err.message ?? "Unable to delete employee." });
      }
    });
  }

  async function handleCountryInsightsSubmit(nextInsightValues) {
    setInsightsError(null);
    setInsightValues(nextInsightValues);

    startInsightsTransition(async () => {
      try {
        const params = new URLSearchParams({ country: nextInsightValues.country.trim() });
        const res = await authenticatedFetch(`/salary_insights/country_stats?${params}`);
        const data = await parseResponse(res);

        if (!res.ok) {
          throw new Error("Unable to load country salary insights.");
        }
        setCountryStats(data);
      } catch (err) {
        setCountryStats(null);
        setInsightsError(err.message ?? "Unable to load country salary insights.");
      }
    });
  }

  async function handleJobTitleInsightsSubmit(nextInsightValues) {
    setInsightsError(null);
    setInsightValues(nextInsightValues);

    startInsightsTransition(async () => {
      try {
        const params = new URLSearchParams({
          country: nextInsightValues.country.trim(),
          job_title: nextInsightValues.job_title.trim(),
        });
        const res = await authenticatedFetch(`/salary_insights/job_title_stats?${params}`);
        const data = await parseResponse(res);

        if (!res.ok) {
          throw new Error("Unable to load role salary insights.");
        }

        setJobTitleStats(data);
      } catch (err) {
        setJobTitleStats(null);
        setInsightsError(err.message ?? "Unable to load role salary insights.");
      }
    });
  }

  if (authStatus === "checking") {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card-loading">
          <span className="spinner" />
          <p>Checking your session...</p>
        </section>
      </main>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <LoginCard
        credentials={credentials}
        authError={authError}
        isSubmitting={isAuthSubmitting}
        onChange={handleCredentialsChange}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <main className="app-shell">
      <DashboardHero
        employeeCount={summary.total_employees}
        totalPayroll={summary.monthly_payroll}
        backendStatus={backendStatus}
        currentUser={currentUser}
        isLoggingOut={isAuthSubmitting}
        onLogout={handleLogout}
      />


      <SalaryInsightsSection
        countries={countries}
        jobTitles={jobTitles}
        formValues={insightValues}
        isPending={isInsightsPending}
        error={insightsError}
        countryStats={countryStats}
        jobTitleStats={jobTitleStats}
        onRunCountryInsights={handleCountryInsightsSubmit}
        onRunJobTitleInsights={handleJobTitleInsightsSubmit}
      />

      {feedback && (
        <div className={`alert-bar ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      {errors.length > 0 && (
        <div className="alert-bar error">
          <strong>Please fix the following:</strong>
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
      <section className="main-grid">
        <EmployeeForm
          editingEmployeeId={editingEmployeeId}
          formValues={formValues}
          isPending={isPending}
          onSubmit={handleSubmit}
          onReset={resetForm}
          onSwitchToAdd={() => { resetForm(); setFeedback(null); }}
        />
        <EmployeeDirectory
          employees={directoryEmployees}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onView={setSelectedEmployee}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </section>

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={openEditForm}
      />
    </main>
  );
}
