import DOMPurify from 'dompurify'
import { WP_URL } from '../api/wordpress.js'

/** 129900 (minor units) -> "₹1,299" with Indian digit grouping. */
export function formatPrice(minor, prices) {
  const unit = prices?.currency_minor_unit ?? 2
  const n = Number(minor) / 10 ** unit
  const symbol = prices?.currency_symbol ?? '₹'
  return symbol + n.toLocaleString('en-IN', { maximumFractionDigits: unit === 0 ? 0 : 2 })
}

/** Removes HTML tags, turns entities such as &amp; into text. */
export function stripHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').trim()
}

/** Makes WordPress HTML safe to show in React. */
export const cleanHtml = html => DOMPurify.sanitize(html || '')

/**
 * Turns a WordPress address into a route of this React app.
 *   http://site/product-category/clothing/  -> /category/clothing
 *   http://site/shop/                       -> /shop
 *   http://site/about/                      -> /about
 *   /category/sale                          -> /category/sale   (already a React route)
 *   https://example.com                     -> stays external
 */
export function toRoute(url = '') {
  if (!url) return '/'
  if (url.startsWith('/')) return url
  if (!url.startsWith(WP_URL)) return url
  const path = url.slice(WP_URL.length).replace(/\/$/, '') || '/'
  const cat = path.match(/^\/product-category\/(?:.*\/)?([^/]+)$/)
  if (cat) return `/category/${cat[1]}`
  const prod = path.match(/^\/product\/([^/]+)$/)
  if (prod) return `/product/${prod[1]}`
  return path
}

export const isExternal = to => /^https?:\/\//.test(to)

/** "Mumbai\nJaipur" -> ["Mumbai", "Jaipur"] */
export const lines = (text = '') => text.split('\n').map(l => l.trim()).filter(Boolean)
