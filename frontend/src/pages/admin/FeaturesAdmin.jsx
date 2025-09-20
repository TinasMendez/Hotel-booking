// src/pages/admin/FeaturesAdmin.jsx
// List + create + inline edit (name, icon) + delete

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { httpDelete, httpGet, httpPost, httpPut } from '../../api/http';
import { useToast } from '../../shared/ToastProvider.jsx';
import { getApiErrorMessage, normalizeApiError } from '../../utils/apiError.js';

function Row({ f, onSave, onDelete, busy }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(f.name || '');
  const [icon, setIcon] = useState(f.icon || '');
  const [description, setDescription] = useState(f.description || '');

  useEffect(() => {
    setName(f.name || '');
    setIcon(f.icon || '');
    setDescription(f.description || '');
  }, [f]);

  const save = async () => {
    const payload = {
      ...f,
      name: name.trim(),
      icon: icon.trim(),
      description: description.trim(),
    };
    await onSave(payload);
    setEditing(false);
  };

  return (
    <tr className="border-t">
      <td className="p-3">{f.id}</td>
      <td className="p-3">
        {editing ? (
          <input className="border rounded p-1 w-full" value={name} onChange={e => setName(e.target.value)} />
        ) : (
          f.name
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <input className="border rounded p-1 w-full" value={icon} onChange={e => setIcon(e.target.value)} />
        ) : (
          f.icon
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <textarea
            className="border rounded p-1 w-full"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        ) : (
          <span className="text-sm text-slate-600 whitespace-pre-line">{f.description || '—'}</span>
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-1 rounded bg-green-600 text-white" disabled={busy}>Save</button>
            <button
              onClick={() => {
                setEditing(false);
                setName(f.name || '');
                setIcon(f.icon || '');
                setDescription(f.description || '');
              }}
              className="px-3 py-1 rounded border"
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="px-3 py-1 rounded border">Edit</button>
            <button onClick={() => onDelete(f.id)} className="px-3 py-1 rounded bg-red-600 text-white" disabled={busy}>Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function FeaturesAdmin() {
  const toast = useToast();
  const { formatMessage } = useIntl();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [rowBusyId, setRowBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await httpGet('/features');
      setItems(Array.isArray(data) ? data : data?.content ?? []);
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: 'errors.generic' }));
      const message = getApiErrorMessage(normalized, formatMessage, formatMessage({ id: 'errors.generic' }));
      setErr(message);
      toast?.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        icon: icon.trim(),
        description: description.trim(),
      };
      if (!payload.name || !payload.icon) {
        throw new Error(formatMessage({ id: 'admin.features.validation.required', defaultMessage: 'Name and icon are required.' }));
      }
      await httpPost('/features', payload);
      setName(''); setIcon(''); setDescription('');
      toast?.success(formatMessage({ id: 'admin.features.createSuccess', defaultMessage: 'Feature created successfully.' }));
      await load();
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: 'errors.generic' }));
      const message = getApiErrorMessage(normalized, formatMessage, e?.message);
      toast?.error(message || formatMessage({ id: 'errors.generic' }));
    }
    setSaving(false);
  };

  const onSaveRow = async (feat) => {
    setRowBusyId(feat.id);
    try {
      const payload = {
        name: (feat.name || '').trim(),
        icon: (feat.icon || '').trim(),
        description: (feat.description || '').trim(),
      };
      if (!payload.name || !payload.icon) {
        throw new Error(formatMessage({ id: 'admin.features.validation.required', defaultMessage: 'Name and icon are required.' }));
      }
      await httpPut(`/features/${feat.id}`, payload);
      toast?.success(formatMessage({ id: 'admin.features.updateSuccess', defaultMessage: 'Feature updated.' }));
      await load();
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: 'errors.generic' }));
      const message = getApiErrorMessage(normalized, formatMessage, e?.message);
      toast?.error(message || formatMessage({ id: 'errors.generic' }));
    } finally {
      setRowBusyId(null);
    }
  };

  const onDeleteRow = async (id) => {
    const confirmed = window.confirm(formatMessage({ id: 'admin.features.confirmDelete', defaultMessage: 'Delete this feature?' }));
    if (!confirmed) return;
    setRowBusyId(id);
    try {
      await httpDelete(`/features/${id}`);
      toast?.success(formatMessage({ id: 'admin.features.deleteSuccess', defaultMessage: 'Feature removed.' }));
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: 'errors.generic' }));
      const message = getApiErrorMessage(normalized, formatMessage, e?.message);
      toast?.error(message || formatMessage({ id: 'errors.generic' }));
    } finally {
      setRowBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Features</h2>
      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {/* Create form */}
      <form onSubmit={onCreate} className="mb-4 bg-white p-4 rounded shadow grid gap-3">
        <h3 className="font-semibold">Add Feature</h3>
        <div className="grid gap-1">
          <label className="text-sm">Name</label>
          <input className="border rounded p-2" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Icon (CSS class or emoji)</label>
          <input className="border rounded p-2" required value={icon} onChange={e => setIcon(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Description</label>
          <textarea
            className="border rounded p-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <button className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black disabled:opacity-60" disabled={saving}>
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Icon</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(f => (
              <Row
                key={f.id}
                f={f}
                onSave={onSaveRow}
                onDelete={onDeleteRow}
                busy={rowBusyId === f.id}
              />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No features.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
