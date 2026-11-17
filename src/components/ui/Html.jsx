import { cleanHtml } from '../../lib/format.js'

/** Shows HTML written in the WordPress editor (made safe first). */
export default function Html({ html, className = '' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml(html) }} />
}
