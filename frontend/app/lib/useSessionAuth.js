"use client";

import { useEffect, useState, useTransition } from "react";
import { clearStoredSession, loadStoredSession, storeSession } from "./auth";

const emptyCredentials = { email: "", password: "" };

async function parseResponse(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default function useSessionAuth({ apiBaseUrl, onLoginSuccess, onUnauthorized, onLogout }) {
  const [authStatus, setAuthStatus] = useState("checking");
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState(emptyCredentials);
  const [authError, setAuthError] = useState(null);
  const [isAuthSubmitting, startAuthTransition] = useTransition();

  useEffect(() => {
    const session = loadStoredSession();

    setAuthToken(session.token);
    setCurrentUser(session.user);
    setAuthStatus(session.token ? "authenticated" : "unauthenticated");
  }, []);

  function handleCredentialsChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  function handleUnauthorized(message = "Your session expired. Please sign in again.") {
    clearStoredSession();
    setAuthToken(null);
    setCurrentUser(null);
    setAuthStatus("unauthenticated");
    setCredentials((prev) => ({ ...prev, password: "" }));
    setAuthError(message);
    onUnauthorized?.();
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setAuthError(null);

    startAuthTransition(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: credentials }),
        });
        const data = await parseResponse(res);

        if (!res.ok) {
          throw new Error(data?.error ?? "Unable to sign in.");
        }

        const token = res.headers.get("Authorization");

        if (!token) {
          throw new Error("Login succeeded, but no auth token was returned.");
        }

        storeSession({ token, user: data?.user ?? null });
        setAuthToken(token);
        setCurrentUser(data?.user ?? null);
        setAuthStatus("authenticated");
        setCredentials(emptyCredentials);
        onLoginSuccess?.();
      } catch (err) {
        setAuthError(err.message ?? "Unable to sign in.");
      }
    });
  }

  function handleLogout() {
    startAuthTransition(async () => {
      try {
        if (authToken) {
          await fetch(`${apiBaseUrl}/logout`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: authToken,
            },
          });
        }
      } catch {}

      clearStoredSession();
      setAuthToken(null);
      setCurrentUser(null);
      setAuthStatus("unauthenticated");
      setCredentials(emptyCredentials);
      setAuthError(null);
      onLogout?.();
    });
  }

  return {
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
  };
}
