import axios from 'axios'
import { WP_URL } from './wordpress.js'
import { getToken } from './account.js'

// WooCommerce keeps the cart on the server. We prove which cart is ours with a "Cart-Token"
// that WordPress hands out; it is stored in the browser and sent with every cart request.
const TOKEN_KEY = 'aurelo_cart_token'
const read = () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } }
const write = t => { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* private mode */ } }

const store = axios.create({ baseURL: `${WP_URL}/wp-json/wc/store/v1`, timeout: 20000 })
store.interceptors.request.use(async config => {
  // WooCommerce only accepts changes from a cart it has issued a token for, so fetch one first if needed
  if (!read() && config.method !== 'get') {
    const res = await axios.get(`${WP_URL}/wp-json/wc/store/v1/cart`)
    if (res.headers['cart-token']) write(res.headers['cart-token'])
  }
  const token = read()
  if (token) config.headers['Cart-Token'] = token
  const login = getToken()
  if (login) config.headers.Authorization = `Bearer ${login}` // lets WordPress attach the order to this customer
  return config
})
store.interceptors.response.use(res => {
  const token = res.headers['cart-token']
  if (token) write(token)
  return res
})

const data = p => p.then(r => r.data)

export const getCart = () => data(store.get('/cart'))
// variation: [{ attribute: 'pa_size', value: 'm' }] for variable products
export const addItem = ({ id, quantity = 1, variation }) => data(store.post('/cart/add-item', { id, quantity, variation }))
export const updateItem = (key, quantity) => data(store.post('/cart/update-item', { key, quantity }))
export const removeItem = key => data(store.post('/cart/remove-item', { key }))
export const applyCoupon = code => data(store.post('/cart/apply-coupon', { code }))
export const removeCoupon = code => data(store.post('/cart/remove-coupon', { code }))
export const updateCustomer = (billing_address, shipping_address) => data(store.post('/cart/update-customer', { billing_address, shipping_address }))
export const selectShippingRate = (package_id, rate_id) => data(store.post('/cart/select-shipping-rate', { package_id, rate_id }))
export const placeOrder = payload => data(store.post('/checkout', payload))
export const getOrder = (id, key, email) => data(store.get(`/order/${id}`, { params: { key, billing_email: email } }))
