import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/layout/Layout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { getOrder } from '../api/cart.js'
import { formatPrice, stripHtml } from '../lib/format.js'

const LABEL = 'font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-ink-muted'

export default function OrderSuccessPage() {
  const [sp] = useSearchParams()
  const id = sp.get('order')
  const key = sp.get('key')
  const email = sp.get('email')
  const payId = sp.get('pay')
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id, key, email),
    enabled: !!(id && key),
  })

  if (!id || !key || isError) {
    return (
      <Layout>
        <section className="mx-auto w-full max-w-[1320px] px-4 py-16 md:px-6 lg:px-8">
          <EmptyState icon="bag" title="We could not find that order" text="If you just placed an order, check your email for the confirmation." actionLabel="Continue shopping" actionTo="/shop" />
        </section>
      </Layout>
    )
  }

  const b = order?.billing_address
  const s = order?.shipping_address
  const t = order?.totals
  const PAY = { aurelo_upi: 'UPI', aurelo_card: 'Credit / debit card', aurelo_netbanking: 'Netbanking', aurelo_cod: 'Cash on delivery' }
  const pay = `${PAY[payId] || 'Demo payment'} (demo)${payId === 'aurelo_cod' ? ', pay on delivery' : ', paid'}`

  return (
    <Layout>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-24 lg:pt-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center">
            <div className="ring grid h-[88px] w-[88px] place-items-center rounded-full bg-success-soft text-success">
              <svg className="ic" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            </div>
            <h1 className="h1 mt-3">{b?.first_name ? `Thank you, ${b.first_name}` : 'Thank you'}</h1>
            <p className="text-[18px] text-ink-muted">Your order is confirmed.{email && ` We have emailed the receipt to ${email}.`}</p>
            <span className="pill ok mt-2">Order {id}</span>
          </div>

          {isLoading ? <div className="sk mx-auto mt-12 h-48 max-w-[1000px]" /> : order && (
            <div className="mx-auto mt-12 grid max-w-[1000px] grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="card">
                <h3 className="h5">Order summary</h3>
                {order.items.map(it => (
                  <div key={it.key} className="ci grid-cols-[72px_1fr_auto] !py-4">
                    {it.images?.[0] ? <img src={it.images[0].thumbnail || it.images[0].src} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                    <div>
                      <div className="nm text-sm leading-[22px]">{stripHtml(it.name)}</div>
                      <div className="meta">{[...(it.variation || []).map(v => v.value), `×${it.quantity}`].join(' · ')}</div>
                    </div>
                    <b className="text-sm leading-[22px]">{formatPrice(it.totals.line_subtotal, it.totals)}</b>
                  </div>
                ))}
                <div className="sum-r"><span>Subtotal</span><span>{formatPrice(t.total_items, t)}</span></div>
                <div className="sum-r"><span>Shipping</span><span>{Number(t.total_shipping) === 0 ? 'Free' : formatPrice(t.total_shipping, t)}</span></div>
                <div className="sum-r tot"><span>Total</span><span>{formatPrice(t.total_price, t)}</span></div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="card">
                  <span className={LABEL}>Shipping address</span>
                  <p className="mt-2 text-sm leading-[22px]">
                    {s.first_name} {s.last_name}<br />{s.address_1}<br />{s.city}, {s.state} {s.postcode}
                  </p>
                </div>
                <div className="card">
                  <span className={LABEL}>Payment</span>
                  <p className="mt-2 text-sm leading-[22px]">{pay}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link className="btn btn-primary btn-lg" to="/account/orders">View order</Link>
            <Link className="btn btn-secondary btn-lg" to="/shop">Continue shopping</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
