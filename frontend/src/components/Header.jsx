import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";

/**
 * Header component with navigation links and user info.
 * - Shows login link when not authenticated.
 * - When authenticated, shows user's avatar with initials and greeting.
 */
export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    const base =
        "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const active = "bg-gray-800 text-white";
    const inactive = "text-gray-300 hover:bg-gray-700 hover:text-white";

    // Derive name and initials
    const displayName =
        user?.firstName && user?.lastName
        ? `${user.firstName}`
        : user?.firstName || user?.email || "User";

    const initials = user?.firstName
        ? user.firstName[0].toUpperCase()
        : (user?.email?.[0] || "U").toUpperCase();

    return (
        <header className="bg-gray-900">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-white font-semibold">
                Digital Booking
            </Link>

            <div className="flex items-center space-x-2">
                <NavLink
                to="/"
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
                >
                Home
                </NavLink>

                {!isAuthenticated ? (
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                    }
                >
                    Login
                </NavLink>
                ) : (
                <>
                    <div className="flex items-center space-x-2">
                    {/* Avatar with initial */}
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {initials}
                    </div>
                    {/* Greeting */}
                    <span className="text-gray-200 text-sm">
                        Hello, {displayName}!
                    </span>
                    </div>
                    <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    >
                    Logout
                    </button>
                </>
                )}
            </div>
            </div>
        </nav>
        </header>
    );
}
