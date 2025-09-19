import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import Api from "../../services/api";
import { useToast } from "../../shared/ToastProvider.jsx";
import { getApiErrorMessage, normalizeApiError } from "../../utils/apiError.js";

export default function CategoryCreateAdmin() {
  const navigate = useNavigate();
  const toast = useToast();
  const { formatMessage } = useIntl();

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const preview = form.imageUrl?.trim() ? form.imageUrl.trim() : "";

  const isValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.imageUrl.trim()) return false;
    return true;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await Api.uploadCategoryImage(file);
      const url = res?.url;
      if (url) {
        setForm((prev) => ({ ...prev, imageUrl: url }));
        toast?.success("Image uploaded");
      }
    } catch (err) {
      const normalized = normalizeApiError(err, formatMessage({ id: "errors.generic" }));
      const message = getApiErrorMessage(normalized, formatMessage);
      setError(message);
      toast?.error(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };
      await Api.createCategory(payload);
      toast?.success("Category created");
      navigate("/admin/categories");
    } catch (err) {
      const normalized = normalizeApiError(err, formatMessage({ id: "errors.generic" }));
      const message = getApiErrorMessage(normalized, formatMessage);
      setError(message);
      toast?.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create category</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded border"
        >
          Back
        </button>
      </div>

      <form
        className="space-y-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
        onSubmit={handleSubmit}
      >
        <section className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              rows={4}
              required
            />
          </label>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Image</h3>
          <p className="text-sm text-gray-600">
            Upload a new image or paste a URL. The first option will store the file under the admin uploads directory.
          </p>
          <div className="flex flex-col md:flex-row gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <label className="w-full md:w-64 h-40 border-dashed border-2 border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer text-sm text-gray-500 bg-white">
              <span>{uploading ? "Uploading..." : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <div className="flex-1 space-y-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Image URL</span>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="rounded border px-3 py-2"
                  placeholder="https://..."
                  required
                />
              </label>
              {preview && (
                <div className="border rounded overflow-hidden w-full md:w-72 h-40">
                  <img src={preview} alt="Category preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Create category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
