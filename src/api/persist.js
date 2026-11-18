// Remembers the last answer of a few rarely-changing requests (site options, menus, categories) in the browser,
// so a page refresh can draw the header, footer and banners instantly while fresh data loads in the background.
const PREFIX = 'aurelo:'

export function readCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

export function writeCache(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch { /* storage full or blocked: just skip caching */ }
}

/** Wraps a fetcher so every successful answer is also saved for the next visit. */
export function remember(key, fetcher) {
  return async (...args) => {
    const data = await fetcher(...args)
    writeCache(key, data)
    return data
  }
}
