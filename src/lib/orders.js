const STATUS = {
  pending: 'Pending payment', processing: 'Processing', 'on-hold': 'On hold', completed: 'Delivered',
  cancelled: 'Cancelled', refunded: 'Refunded', failed: 'Failed',
}

export const statusLabel = s => STATUS[s] || s

export const money = (n, currency) => (currency === 'INR' ? '₹' : currency + ' ') + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })
export const day = iso => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

export const orderTitle = o => (o.items[0] ? o.items[0].name + (o.items.length > 1 ? ` +${o.items.length - 1}` : '') : '—')
