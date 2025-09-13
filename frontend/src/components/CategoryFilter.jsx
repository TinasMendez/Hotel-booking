    import { useEffect, useState } from 'react'
    import { getCategories } from '../services/products'

    export default function CategoryFilter({ value, onChange }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [list, setList] = useState([])

    useEffect(() => {
        let active = true
        async function load() {
        setLoading(true); setError('')
        try {
            const cats = await getCategories()
            if (!active) return
            setList(cats)
        } catch (e) {
            if (!active) return
            // If 401/403, hide the error and keep dropdown with "All"
            const msg = e?.message || ''
            if (msg.includes('HTTP 401') || msg.includes('HTTP 403')) {
            setList([]); setError('')
            } else {
            setError(msg || 'Failed to load categories')
            }
        } finally {
            if (active) setLoading(false)
        }
        }
        load()
        return () => { active = false }
    }, [])

    return (
        <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-3">
            <label className="text-sm">Category:</label>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
            {!loading && !error && (
            <select
                className="rounded border px-3 py-2"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
            >
                <option value="">All</option>
                {list.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name || c.title || `#${c.id}`}
                </option>
                ))}
            </select>
            )}
            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        </div>
    )
    }

