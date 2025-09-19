import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../services/api';
import { useToast } from '../shared/ToastProvider.jsx';

/**
 * Minimal register page. Adjust fields to match your backend DTO.
 */
export default function Register() {
    const navigate = useNavigate();
    const toast = useToast();
    const [firstName, setFirstName] = useState('');
    const [lastName,  setLastName]  = useState('');
    const [email,     setEmail]     = useState('');
    const [password,  setPassword]  = useState('');
    const [loading,   setLoading]   = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
        await AuthAPI.register({ firstName, lastName, email, password });
        toast?.success('Account created. Please sign in.');
        navigate('/login');
        } catch (err) {
        const msg = err?.payload?.message || err?.message || 'Register error';
        toast?.error(`Register failed: ${msg}`);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white text-slate-900 p-6 rounded-xl shadow w-full max-w-sm grid gap-4"
        >
            <h1 className="text-xl font-semibold">Register</h1>
            <label className="grid gap-1">
            <span className="text-sm">First name</span>
            <input
              className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="John"
              value={firstName}
              onChange={(e)=>setFirstName(e.target.value)}
            />
            </label>
            <label className="grid gap-1">
            <span className="text-sm">Last name</span>
            <input
              className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="Doe"
              value={lastName}
              onChange={(e)=>setLastName(e.target.value)}
            />
            </label>
            <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            </label>
            <label className="grid gap-1">
            <span className="text-sm">Password</span>
            <input
              type="password"
              className="border rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            </label>
            <button type="submit" disabled={loading} className="bg-emerald-600 text-white rounded-lg px-4 py-2 disabled:opacity-60">
            {loading ? 'Creating…' : 'Create account'}
            </button>
        </form>
        </div>
    );
    }
