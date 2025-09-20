import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { useToast } from '../shared/ToastProvider.jsx';

export default function Login() {
  const { login, isLoadingAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state ?? null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const status = locationState?.status ?? null;
  const reason = locationState?.reason;
  const redirectTo = useMemo(() => {
    const from = locationState?.from;
    if (!from) return '/';
    if (typeof from === 'string') return from || '/';
    if (typeof from === 'object' && from.pathname) {
      return `${from.pathname}${from.search || ''}${from.hash || ''}`;
    }
    return '/';
  }, [locationState]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      toast?.success('Signed in successfully');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err?.payload?.message || err?.message || 'Login error';
      toast?.error(`Login failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-slate-900 p-6 rounded-xl shadow w-full max-w-sm grid gap-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>
        {status?.type === 'error' ? (
          <p className="text-sm text-rose-800 bg-rose-100 border border-rose-200 rounded-lg px-3 py-2">
            {status.message}
          </p>
        ) : null}
        {status?.type === 'success' ? (
          <p className="text-sm text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2">
            {status.message}
          </p>
        ) : null}
        {reason ? (
          <p className="text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-3 py-2">
            {reason}
          </p>
        ) : null}
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={isLoadingAuth || submitting}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
