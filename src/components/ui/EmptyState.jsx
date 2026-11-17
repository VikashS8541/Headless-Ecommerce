import { Link } from 'react-router'
import Icon from '../Icon.jsx'
import { useSite } from '../../api/hooks.js'

/**
 * icon: 'search' | 'bag' | 'heart' | 'user'
 * kind: the text comes from WordPress (Aurelo Content > Empty and error pages): <kind>_title, <kind>_text, <kind>_button.
 *       Without kind, the title / text / actionLabel props are used (for error messages).
 */
export default function EmptyState({ kind, vars = {}, title, text, actionLabel, actionTo, icon = 'search' }) {
  const { data } = useSite()
  const o = data?.options || {}
  const fill = v => Object.entries(vars).reduce((t, [k, val]) => t.replaceAll('{' + k + '}', val), v || '')
  if (kind) {
    title = fill(o[kind + '_title'])
    text = fill(o[kind + '_text'])
    actionLabel = o[kind + '_button'] || o[kind + '_btn1']
  }
  return (
    <div className="empty frame">
      <div className="ring"><Icon name={icon} size={36} /></div>
      {title && <h3 className="h4">{title}</h3>}
      {text && <p className="text-sm leading-[22px] text-ink-muted">{text}</p>}
      {actionLabel && <Link className="btn btn-primary mt-3" to={actionTo}>{actionLabel}</Link>}
    </div>
  )
}
