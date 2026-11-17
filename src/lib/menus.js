import { stripHtml, toRoute } from './format.js'

/** Top-level items of a WordPress menu as { title, to }. An empty or missing menu gives an empty list. */
export function menuItems(menu) {
  return (menu || []).filter(i => !i.parent).map(i => ({ title: stripHtml(i.title), to: toRoute(i.url) }))
}
