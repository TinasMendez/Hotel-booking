import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { setToken, getToken, clearToken } from '@/services/api'

// AuthContext: keeps JWT and user info in memory and localStorage.
// Adjust /auth/* endpoints to your backend if needed.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const me = await api.get('/auth/me')
        setUser(me)
      } catch (_) {
        doLogout(false)
      } finally {
        setLoading(false)
      }
    }
    loadMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function doLogin(credentials) {
    const res = await api.post('/auth/login', credentials)
    const jwt = res?.token || res?.jwt || ''
    if (!jwt) throw new Error('Login did not return a token')
    setToken(jwt)
    setTokenState(jwt)
    try {
      const me = await api.get('/auth/me')
      setUser(me)
    } catch {
      setUser(null)
    }
    return true
  }

  function doLogout(clear = true) {
    clearToken()
    setTokenState('')
    if (clear) setUser(null)
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login: doLogin,
    logout: doLogout,
    isAuthenticated: !!token
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
