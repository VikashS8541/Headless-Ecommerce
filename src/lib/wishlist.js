import { useSyncExternalStore } from 'react'

// The wishlist is a personal list kept in the visitor's browser (no account needed).
const KEY = 'aurelo_wishlist'
let ids = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } })()
const listeners = new Set()
const emit = () => listeners.forEach(l => l())

function toggleWishlist(id) {
  ids = ids.includes(id) ? ids.filter(x => x !== id) : [id, ...ids]
  try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* private mode */ }
  emit()
}

export function useWishlist() {
  const list = useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb) }, () => ids, () => ids)
  return { ids: list, has: id => list.includes(id), toggle: toggleWishlist }
}
