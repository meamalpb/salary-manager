const TOKEN_KEY = "salary-manager.jwt";
const USER_KEY = "salary-manager.user";

export function loadStoredSession() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);

  if (!token) {
    return { token: null, user: null };
  }

  try {
    return {
      token,
      user: rawUser ? JSON.parse(rawUser) : null,
    };
  } catch {
    clearStoredSession();
    return { token: null, user: null };
  }
}

export function storeSession({ token, user }) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
