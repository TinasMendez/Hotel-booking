import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { AdminAPI } from "../../services/api.js";
import { getApiErrorMessage, normalizeApiError } from "../../utils/apiError.js";

export default function AdminRoles() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { formatMessage } = useIntl();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const list = await AdminAPI.listAdmins();
      setAdmins(Array.isArray(list) ? list : []);
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: "errors.generic" }));
      setError(getApiErrorMessage(normalized, formatMessage));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleGrant(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await AdminAPI.grantAdmin(email.trim());
      setMessage(`Granted ADMIN role to ${email.trim()}`);
      setEmail("");
      await load();
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: "errors.generic" }));
      setError(getApiErrorMessage(normalized, formatMessage));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(targetEmail) {
    const confirm = window.confirm(`Remove ADMIN role from ${targetEmail}?`);
    if (!confirm) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await AdminAPI.revokeAdmin(targetEmail);
      setMessage(`Revoked ADMIN role from ${targetEmail}`);
      await load();
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: "errors.generic" }));
      setError(getApiErrorMessage(normalized, formatMessage));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Administrators</h2>
        <p className="text-sm text-gray-500">Assign or revoke ADMIN role by email.</p>
      </header>

      <form onSubmit={handleGrant} className="flex flex-wrap gap-3 items-end">
        <label className="flex flex-col flex-1 min-w-[240px]">
          <span className="text-sm text-gray-600">User email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="border rounded-lg px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Grant ADMIN"}
        </button>
      </form>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p>Loading admins…</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-600">No administrators yet. Use the form above to add one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Roles</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b">
                  <td className="py-2 px-3">{admin.email}</td>
                  <td className="py-2 px-3 text-sm text-gray-600">{Array.isArray(admin.roles) ? admin.roles.join(", ") : ""}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleRevoke(admin.email)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white disabled:opacity-60"
                      disabled={submitting}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
