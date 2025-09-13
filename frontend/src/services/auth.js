    import Api from "/src/services/api.js";

    const LOGIN_ENDPOINT = '/api/auth/login' 

    function extractToken(data) {
    return (
        data?.token ||
        data?.jwt ||
        data?.accessToken ||
        data?.id_token ||
        data?.authorization ||
        null
    )
    }

    function authError(e) {
    if (e?.response) {
        const { status, data } = e.response
        const msg = typeof data === 'string' ? data : (data?.message || 'Forbidden')
        return new Error(`HTTP ${status} during login: ${msg}`)
    }
    if (e?.request) return new Error('Network error (no response) during login')
    return new Error(e?.message || 'Unknown error during login')
    }

    /** Returns { token, username, roles } */
    export async function loginUser({ email, password }) {
    try {
        const { data } = await Api.post(LOGIN_ENDPOINT, { email, password })
        const token = extractToken(data)
        if (!token) throw new Error('No token in response')
        const username =
        data?.username ||
        data?.user?.username ||
        data?.user?.email ||
        data?.email ||
        email
        const roles = data?.roles || data?.authorities || data?.user?.roles || []
        return { token, username, roles }
    } catch (e) {
        throw authError(e)
    }
    }

    // Alias if you prefer import { login }
    export const login = loginUser



