// /frontend/src/pages/admin/CategoriesAdmin.jsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import Api from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

/** Admin page to list and delete categories. */
export default function CategoriesAdmin() {
  const { formatMessage } = useIntl();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await Api.getCategories();
      setList(Array.isArray(data) ? data : data.content ?? []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const deleteTitle = useMemo(() => {
    if (!deleteTarget) return "";
    return formatMessage(
      { id: "admin.categories.deleteConfirmTitle", defaultMessage: "Delete {name}?" },
      { name: deleteTarget.name },
    );
  }, [deleteTarget, formatMessage]);

  const deleteDescription = useMemo(() => {
    if (!deleteTarget) return "";
    return formatMessage(
      {
        id: "admin.categories.deleteConfirmDescription",
        defaultMessage:
          "You are about to delete \"{name}\". Make sure to review any products that depend on this category before continuing.",
      },
      { name: deleteTarget.name },
    );
  }, [deleteTarget, formatMessage]);

  const deleteWarning = useMemo(
    () =>
      formatMessage({
        id: "admin.categories.deleteConfirmWarning",
        defaultMessage:
          "If the category has associated products, you will need to reassign or remove them. Otherwise, the deletion will be blocked.",
      }),
    [formatMessage],
  );

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    setActionError("");
    setActionMessage("");
    setDeleteError("");
    setDeleteBusy(true);
    try {
      await Api.deleteCategory(deleteTarget.id);
      setActionMessage(
        formatMessage({ id: "admin.categories.deleteSuccess", defaultMessage: "Category deleted successfully." }),
      );
      setDeleteTarget(null);
      await load();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) {
        setDeleteError(
          formatMessage(
            {
              id: "admin.categories.deleteConflict",
              defaultMessage:
                "Cannot delete \"{name}\" because it still has products assigned. Reassign or remove those products and try again.",
            },
            { name: deleteTarget.name },
          ),
        );
      } else {
        setActionError(
          e.message || formatMessage({ id: "admin.categories.deleteError", defaultMessage: "Could not delete the category." }),
        );
        setDeleteTarget(null);
      }
    }
    setDeleteBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: "admin.categories.title", defaultMessage: "Categories" })}
        </h2>
        <Link
          to="/admin/categories/new"
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          {formatMessage({ id: "admin.categories.add", defaultMessage: "Add category" })}
        </Link>
      </div>
      {loading && (
        <p>{formatMessage({ id: "admin.categories.loading", defaultMessage: "Loading..." })}</p>
      )}
      {err && (
        <p className="text-red-600">
          {formatMessage({ id: "admin.categories.error", defaultMessage: "Error: {error}" }, { error: err })}
        </p>
      )}
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
              <th className="py-2">
                {formatMessage({ id: "admin.categories.column.id", defaultMessage: "ID" })}
              </th>
              <th className="py-2">
                {formatMessage({ id: "admin.categories.column.name", defaultMessage: "Name" })}
              </th>
              <th className="py-2">
                {formatMessage({ id: "admin.categories.column.actions", defaultMessage: "Actions" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{c.id}</td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => {
                      setDeleteTarget(c);
                      setDeleteError("");
                    }}
                    className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    title={formatMessage({ id: "admin.categories.delete", defaultMessage: "Delete category" })}
                  >
                    {formatMessage({ id: "admin.categories.delete", defaultMessage: "Delete category" })}
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  {formatMessage({ id: "admin.categories.empty", defaultMessage: "No categories found." })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={formatMessage({ id: "admin.categories.confirm", defaultMessage: "Confirm" })}
        cancelLabel={formatMessage({ id: "admin.categories.cancel", defaultMessage: "Cancel" })}
        onConfirm={onConfirmDelete}
        onCancel={() => {
          if (deleteBusy) return;
          setDeleteTarget(null);
          setDeleteError("");
        }}
        busy={deleteBusy}
        errorMessage={deleteError}
      >
        <p className="text-sm text-slate-600">{deleteWarning}</p>
      </ConfirmDialog>
    </div>
  );
}
