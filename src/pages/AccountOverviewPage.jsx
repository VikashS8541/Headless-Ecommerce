import { Link } from 'react-router'
import AccountLayout from '../components/layout/AccountLayout.jsx'
import OrdersTable from '../components/ui/OrdersTable.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAuth, useOrders } from '../api/hooks.js'

const LABEL = 'font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-ink-muted'

export default function AccountOverviewPage() {
  const { user } = useAuth()
  const { data: orders = [], isLoading } = useOrders(!!user)
  const done = orders.filter(o => o.status === 'completed').length
  const open = orders.filter(o => ['pending', 'processing', 'on-hold'].includes(o.status)).length
  const initials = (user?.name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const since = user?.since ? new Date(user.since).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : ''

  return (
    <AccountLayout>
      <div className="flex items-center gap-4">
        <div className="avatar h-[72px] w-[72px] text-[24px]">{initials}</div>
        <div>
          <h1 className="h2">Welcome back, {user?.first_name || user?.name}</h1>
          {since && <p className="text-ink-muted">Member since {since}</p>}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="stat"><span className={LABEL}>Total orders</span><b>{orders.length}</b></div>
        <div className="stat"><span className={LABEL}>Pending</span><b>{open}</b></div>
        <div className="stat"><span className={LABEL}>Completed</span><b>{done}</b></div>
      </div>
      <div className="card mt-8 p-2 pb-0">
        <div className="flex items-center justify-between p-4">
          <h3 className="h4">Recent orders</h3>
          <Link className="btn btn-ghost text-sm leading-[22px]" to="/account/orders">View all</Link>
        </div>
        {isLoading ? <div className="sk m-4 h-24" /> : orders.length ? <OrdersTable orders={orders.slice(0, 3)} /> : (
          <EmptyState icon="bag" kind="orders_empty" actionTo="/shop" />
        )}
      </div>
      <div className="card mt-8 flex flex-col gap-2">
        <h3 className="h4">Account information</h3>
        <p className="text-sm leading-[22px]">{user?.name}<br />{user?.email}{user?.phone && <><br />{user.phone}</>}</p>
        <Link className="btn btn-secondary btn-sm mt-4 self-start" to="/account/profile">Edit profile</Link>
      </div>
    </AccountLayout>
  )
}
