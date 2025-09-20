import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { useToast } from '../shared/ToastProvider.jsx';

export default function Login() {
  const { login, isLoadingAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const guardMessage = location.state?.message;
  const returnTo = location.state?.from;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      clearStatus();
      setSubmitting(true);
      await login(email.trim(), password);
      setStatus({ type: 'success', message: 'Signed in successfully' });
      toast?.success('Signed in successfully');
      const nextPath = returnTo
        ? `${returnTo.pathname}${returnTo.search || ''}${returnTo.hash || ''}`
        : '/';
      navigate(nextPath, { replace: true });
    } catch (err) {
      const msg = err?.payload?.message || err?.message || 'Login error';
      setStatus({ type: 'error', message: `Login failed: ${msg}` });
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
        {guardMessage ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {guardMessage}
          </p>
        ) : null}
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
            value={email}
            onChange={(e) => {
              if (status.type) clearStatus();
              setEmail(e.target.value);
            }}
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
            onChange={(e) => {
              if (status.type) clearStatus();
              setPassword(e.target.value);
            }}
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
