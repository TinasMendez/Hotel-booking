import { Link } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ background: "#111827", color: "#fff", padding: "12px 16px" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            to="/"
            style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}
          >
            Digital Booking
          </Link>
          <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/favorites"
              style={{ color: "#cbd5e1", textDecoration: "none" }}
            >
              My Favorites
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/bookings"
              style={{ color: "#cbd5e1", textDecoration: "none" }}
            >
              My Bookings
            </Link>
          )}
        </div>
        <div>
          {!isAuthenticated ? (
            <Link
              to="/login"
              style={{
                color: "#fff",
                background: "#2563eb",
                padding: "8px 12px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#cbd5e1" }}>
                {user?.username}
              </span>
              <button
                onClick={logout}
                style={{
                  color: "#111827",
                  background: "#f3f4f6",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
