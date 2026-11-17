import axios from 'axios'
import { WP_URL } from './wordpress.js'

// Accounts are handled by WordPress (see aurelo-headless-extras.php).
// After login WordPress returns a signed token; we keep it in the browser and send it as "Bearer".
const TOKEN_KEY = 'aurelo_auth_token' // sessionStorage: cleared when the tab closes
export const getToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null } }
export const setToken = t => {
  try { localStorage.removeItem(TOKEN_KEY); if (t) sessionStorage.setItem(TOKEN_KEY, t); else sessionStorage.removeItem(TOKEN_KEY) } catch { /* private mode */ }
}

const api = axios.create({ baseURL: `${WP_URL}/wp-json/aurelo/v1`, timeout: 20000 })
api.interceptors.request.use(config => {
  const t = getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
const data = p => p.then(r => r.data)

export const login = body => data(api.post('/auth/login', body))
export const register = body => data(api.post('/auth/register', body))
export const forgotPassword = email => data(api.post('/auth/forgot', { email }))
export const fetchMe = () => data(api.get('/me'))
export const updateMe = body => data(api.post('/me', body))
export const changePassword = body => data(api.post('/me/password', body))
export const fetchOrders = () => data(api.get('/orders'))
export const sendContact = body => data(api.post('/contact', body))
export const subscribe = email => data(api.post('/subscribe', { email }))
