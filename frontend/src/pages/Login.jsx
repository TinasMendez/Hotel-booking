import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export default function Login() {
  const { login, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      alert('Login success ✅');
      navigate('/');
    } catch (err) {
      const msg = err?.payload?.message || err?.message || 'Login error';
      alert(`Login failed ❌: ${msg}`);
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
