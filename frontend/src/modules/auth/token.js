// src/modules/auth/token.js
const TOKEN_KEY = 'db_token'
const USER_KEY = 'db_user'

export const saveToken = (t) => localStorage.setItem(TOKEN_KEY, t || '')
export const getToken = () => localStorage.getItem(TOKEN_KEY) || null
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const saveUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u || {}))
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
export const clearUser = () => localStorage.removeItem(USER_KEY)

