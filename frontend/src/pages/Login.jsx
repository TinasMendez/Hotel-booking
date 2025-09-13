import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import { useToast } from "../shared/ToastProvider";

/** Simple email/password login that stores the JWT. */
export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ email, password });
      toast.success("Logged in successfully");
      nav(from, { replace: true });
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full border rounded-md px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full border rounded-md px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 disabled:opacity-60"
      >
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
