import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold">
            Digital Booking
            </Link>
            <nav className="flex items-center gap-4">
            <Link to="/" className="opacity-90 hover:opacity-100">Home</Link>
            {user ? (
                <>
                <span className="opacity-90">{user.email || user.username}</span>
                <button
                    onClick={logout}
                    className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1"
                >
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link to="/login" className="opacity-90 hover:opacity-100">Login</Link>
                <Link to="/register" className="opacity-90 hover:opacity-100">Register</Link>
                </>
            )}
            </nav>
        </div>
        </header>
    );
}
