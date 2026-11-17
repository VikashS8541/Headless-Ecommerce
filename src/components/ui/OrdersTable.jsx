import { day, money, orderTitle, statusLabel } from '../../lib/orders.js'

/** A table of the customer's orders. onSelect(order) is called by the "View details" button. */
export default function OrdersTable({ orders, onSelect, selectedId }) {
  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr><th>Order</th><th>Date</th><th>Products</th><th>Total</th><th>Payment</th><th>Status</th>{onSelect && <th />}</tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td><b>#{o.number}</b></td>
              <td>{day(o.date)}</td>
              <td>{orderTitle(o)}</td>
              <td>{money(o.total, o.currency)}</td>
              <td><span className={`pill ${o.paid ? 'ok' : 'warn'}`}><i />{o.paid ? 'Paid' : o.payment || 'Due'}</span></td>
              <td><span className={`pill ${o.status === 'completed' ? 'ok' : o.status === 'cancelled' || o.status === 'failed' ? 'err' : ''}`}><i />{statusLabel(o.status)}</span></td>
              {onSelect && (
                <td><button className="btn btn-secondary btn-sm" aria-expanded={selectedId === o.id} onClick={() => onSelect(o)}>{selectedId === o.id ? 'Hide' : 'View details'}</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

