"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import DashboardHero from "./components/DashboardHero";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeDirectory from "./components/EmployeeDirectory";
import EmployeeModal from "./components/EmployeeModal";
import SalaryInsightsSection from "./components/SalaryInsightsSection";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000";

const emptyForm = {
  first_name: "", last_name: "", email: "",
  mobile_number: "", job_title: "", country: "", salary: "",
};

async function parseResponse(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([checkBackendStatus(), loadEmployees()]);
      setIsLoading(false);
    })();
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [e.full_name, e.email, e.job_title, e.country]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [employees, searchTerm]);

  const totalPayroll = useMemo(
    () => employees.reduce((sum, e) => sum + Number(e.salary ?? 0), 0),
    [employees]
  );

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

  async function loadEmployees() {
    try {
      const res = await fetch(`${apiBaseUrl}/employees`, { cache: "no-store" });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error("Unable to load employees.");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: "error", message: err.message ?? "Unable to load employees." });
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

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleInsightsInputChange(e) {
    const { name, value } = e.target;
    setInsightValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setFeedback(null);

    const method = editingEmployeeId ? "PUT" : "POST";
    const endpoint = editingEmployeeId
      ? `${apiBaseUrl}/employees/${editingEmployeeId}`
      : `${apiBaseUrl}/employees`;

    startTransition(async () => {
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee: { ...formValues, salary: Number(formValues.salary || 0) } }),
        });
        const data = await parseResponse(res);
        if (!res.ok) { setErrors(data?.errors ?? ["Unable to save employee."]); return; }
        setFeedback({ type: "success", message: editingEmployeeId ? "Employee updated." : "Employee added." });
        resetForm();
        await Promise.all([loadEmployees(), checkBackendStatus()]);
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
        const res = await fetch(`${apiBaseUrl}/employees/${employee.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Unable to delete employee.");
        if (selectedEmployee?.id === employee.id) setSelectedEmployee(null);
        if (editingEmployeeId === employee.id) resetForm();
        setFeedback({ type: "success", message: "Employee deleted." });
        await Promise.all([loadEmployees(), checkBackendStatus()]);
      } catch (err) {
        setFeedback({ type: "error", message: err.message ?? "Unable to delete employee." });
      }
    });
  }

  async function handleCountryInsightsSubmit(e) {
    e.preventDefault();
    setInsightsError(null);

    startInsightsTransition(async () => {
      try {
        const params = new URLSearchParams({ country: insightValues.country.trim() });
        const res = await fetch(`${apiBaseUrl}/salary_insights/country_stats?${params}`);
        const data = await parseResponse(res);

        if (!res.ok) {
          throw new Error("Unable to load country salary insights.");
        }
        console.log(`country stats${data}`)
        setCountryStats(data);
      } catch (err) {
        setCountryStats(null);
        setInsightsError(err.message ?? "Unable to load country salary insights.");
      }
    });
  }

  async function handleJobTitleInsightsSubmit(e) {
    e.preventDefault();
    setInsightsError(null);

    startInsightsTransition(async () => {
      try {
        const params = new URLSearchParams({
          country: insightValues.country.trim(),
          job_title: insightValues.job_title.trim(),
        });
        const res = await fetch(`${apiBaseUrl}/salary_insights/job_title_stats?${params}`);
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

  return (
    <main className="app-shell">
      <DashboardHero
        employeeCount={employees.length}
        totalPayroll={totalPayroll}
        backendStatus={backendStatus}
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
      <SalaryInsightsSection
        countries={countries}
        jobTitles={jobTitles}
        formValues={insightValues}
        isPending={isInsightsPending}
        error={insightsError}
        countryStats={countryStats}
        jobTitleStats={jobTitleStats}
        onInputChange={handleInsightsInputChange}
        onRunCountryInsights={handleCountryInsightsSubmit}
        onRunJobTitleInsights={handleJobTitleInsightsSubmit}
      />
      <section className="main-grid">
        <EmployeeForm
          editingEmployeeId={editingEmployeeId}
          formValues={formValues}
          isPending={isPending}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
          onSwitchToAdd={() => { resetForm(); setFeedback(null); }}
        />
        <EmployeeDirectory
          employees={filteredEmployees}
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
