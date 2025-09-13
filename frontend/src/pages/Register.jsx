
import { useState } from 'react'

export default function Register() {
    // NOTE: Keep it simple for now; hook up to backend later.
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [message, setMessage] = useState('')

    const onChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setMessage('Submitting...')
        // TODO: Wire to backend endpoint when confirmed
        // await api.post('/api/auth/register', form)
        setTimeout(() => setMessage('Registration submitted (mock).'), 300)
    }

    return (
        <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
                className="w-full rounded border px-3 py-2"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                required
            />
            </div>

            <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
                className="w-full rounded border px-3 py-2"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                required
            />
            </div>

            <div>
            <label className="block text-sm mb-1">Email</label>
            <input
                className="w-full rounded border px-3 py-2"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
            />
            </div>

            <div>
            <label className="block text-sm mb-1">Password</label>
            <input
                className="w-full rounded border px-3 py-2"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
            />
            </div>

            <button className="rounded bg-blue-600 text-white px-4 py-2">
            Sign up
            </button>

            {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
        </div>
    )
    }
