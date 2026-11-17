import { Link } from 'react-router'
import { isExternal, toRoute } from '../../lib/format.js'

/** A link whose address comes from WordPress. Local pages use the router, outside addresses open normally. */
export default function SmartLink({ to, children, ...rest }) {
  const target = toRoute(to)
  if (isExternal(target)) return <a href={target} {...rest}>{children}</a>
  return <Link to={target} {...rest}>{children}</Link>
}
