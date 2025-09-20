// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import { useToast } from "../shared/ToastProvider.jsx";

export default function Login() {
  const { login, isLoadingAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const guardMessage = location.state?.message || "";
  const returnTo = location.state?.from || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  function clearStatus() {
    if (status.type) setStatus({ type: "", message: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearStatus();
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      setStatus({ type: "success", message: "Signed in successfully" });
      toast?.success?.("Signed in successfully");
      const next =
        returnTo?.pathname
          ? `${returnTo.pathname}${returnTo.search || ""}${returnTo.hash || ""}`
          : "/";
      navigate(next, { replace: true });
    } catch {
      setStatus({ type: "error", message: "Invalid credentials. Please try again." });
      toast?.error?.("Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md mt-24 bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

        {guardMessage ? (
          <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            {guardMessage}
          </div>
        ) : null}

        {status.type === "error" ? (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {status.message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              placeholder="vale@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={isLoadingAuth || submitting}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 disabled:opacity-60 w-full"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
