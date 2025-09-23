// /frontend/src/pages/admin/CategoriesAdmin.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Api from "../../services/api";

/** Admin page to list and delete categories. */
export default function CategoriesAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    category: null,
    loading: false,
    error: "",
  });
  const { formatMessage } = useIntl();

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await Api.getCategories();
      setList(Array.isArray(data) ? data : (data.content ?? []));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openConfirm(category) {
    setConfirmState({ open: true, category, loading: false, error: "" });
  }

  function closeConfirm() {
    setConfirmState({ open: false, category: null, loading: false, error: "" });
  }

  async function handleDelete() {
    const category = confirmState.category;
    if (!category) return;
    setActionError("");
    setActionMessage("");
    setConfirmState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      await Api.deleteCategory(category.id);
      setActionMessage(formatMessage({ id: "admin.categories.deleteSuccess" }));
      closeConfirm();
      await load();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) {
        setConfirmState((prev) => ({
          ...prev,
          loading: false,
          error: formatMessage({ id: "admin.categories.deleteInUse" }),
        }));
      } else {
        setConfirmState((prev) => ({ ...prev, loading: false }));
        setActionError(
          e.message || formatMessage({ id: "admin.categories.deleteError" }),
        );
        closeConfirm();
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link
          to="/admin/categories/new"
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Add category
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      {err && <p className="text-red-600">Error: {err}</p>}
      {actionMessage && (
        <p className="text-green-600" role="status">
          {actionMessage}
        </p>
      )}
      {actionError && (
        <p className="text-red-600" role="alert">
          {actionError}
        </p>
      )}

      {!loading && !err && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{c.id}</td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => openConfirm(c)}
                    className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    title="Delete category"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.category
            ? formatMessage(
                { id: "admin.categories.confirmTitle" },
                { name: confirmState.category.name },
              )
            : ""
        }
        description={
          confirmState.category
            ? formatMessage(
                { id: "admin.categories.confirmDescription" },
                { name: confirmState.category.name },
              )
            : ""
        }
        confirmLabel={formatMessage({ id: "admin.categories.confirmAction" })}
        confirmLoadingLabel={formatMessage({
          id: "admin.categories.confirmActionLoading",
        })}
        cancelLabel={formatMessage({ id: "admin.categories.cancelAction" })}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
        loading={confirmState.loading}
        errorMessage={confirmState.error}
      />
    </div>
  );
}
