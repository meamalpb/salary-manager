const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000";

async function getBackendStatus() {
  try {
    const response = await fetch(`${apiBaseUrl}/up`, { cache: "no-store" });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      status: "unreachable",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function getEmployeesPreview() {
  try {
    const response = await fetch(`${apiBaseUrl}/employees`, { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const employees = await response.json();
    return Array.isArray(employees) ? employees.slice(0, 5) : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [backendStatus, employees] = await Promise.all([
    getBackendStatus(),
    getEmployeesPreview(),
  ]);

  return (
    <main >
        Backend health: {backendStatus.ok ? "Connected" : "Not reachable"} 
        <br/>
        API base URL: <code>{apiBaseUrl}</code>
        <br/>
        Response status: <code>{String(backendStatus.status)}</code>
    </main>
  );
}
