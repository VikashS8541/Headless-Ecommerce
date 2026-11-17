import { useState } from 'react'
import { Link } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import { useCart, useCartActions, useProducts, useSite } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { formatPrice, stripHtml } from '../lib/format.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'
const SECTION = 'pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24'
// Tailwind needs full class names written out, so the bar width is picked from this list
const BAR = { 0: 'w-0', 10: 'w-[10%]', 20: 'w-[20%]', 30: 'w-[30%]', 40: 'w-[40%]', 50: 'w-[50%]', 60: 'w-[60%]', 70: 'w-[70%]', 80: 'w-[80%]', 90: 'w-[90%]', 100: 'w-full' }

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart()
  const { data: site } = useSite()
  const FREE_SHIPPING_ABOVE = Number(site?.options?.free_shipping_threshold) || 0 // set in WordPress: Aurelo Content > Cart
  const { update, remove, applyCoupon, removeCoupon } = useCartActions()
  const [code, setCode] = useState('')
  const { data: more, isLoading: moreLoading } = useProducts({ per_page: 4, orderby: 'popularity', order: 'desc' })

  if (isLoading) return <Layout><section className={`${SECTION} ${WRAP}`}><div className="sk h-64" /></section></Layout>
  if (isError) {
    return <Layout><section className={`${SECTION} ${WRAP}`}><EmptyState icon="bag" title="We could not load your cart" text="Please refresh the page." /></section></Layout>
  }

  const items = cart.items || []
  if (!items.length) {
    return (
      <Layout>
        <section className={`${SECTION} ${WRAP}`}>
          <EmptyState icon="bag" kind="cart_empty" actionTo="/shop" />
        </section>
      </Layout>
    )
  }

  const t = cart.totals
  const subtotal = Number(t.total_items) / 10 ** t.currency_minor_unit
  const away = Math.max(0, FREE_SHIPPING_ABOVE - subtotal)
  const pct = FREE_SHIPPING_ABOVE > 0 ? Math.min(100, Math.round((subtotal / FREE_SHIPPING_ABOVE) * 100)) : 0
  const busy = update.isPending || remove.isPending
  const error = [update, remove, applyCoupon, removeCoupon].map(m => m.error).find(Boolean)
  const discount = Number(t.total_discount)

  return (
    <Layout>
      <section className={SECTION}>
        <div className={WRAP}>
          <h1 className="h1">Your cart <span className="text-[20px] text-ink-muted">({cart.items_count} {cart.items_count === 1 ? 'item' : 'items'})</span></h1>
          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_420px] lg:gap-16">
            <div>
              {FREE_SHIPPING_ABOVE > 0 && (
                <>
                  {away > 0 ? (
                    <p className="text-sm leading-[22px]">You are <b>₹{Math.ceil(away).toLocaleString('en-IN')}</b> away from free shipping</p>
                  ) : (
                    <p className="text-sm leading-[22px]"><b>You have free shipping</b></p>
                  )}
                  <div className="ship-bar mt-2"><i className={BAR[Math.floor(pct / 10) * 10]} /></div>
                </>
              )}
              {error && <p className="msg err mt-3" role="alert">{errorMessage(error)}</p>}
              <div className={`mt-4 border-t border-border ${busy ? 'opacity-60' : ''}`}>
                {items.map(it => {
                  const img = it.images?.[0]
                  const slug = it.permalink?.split('/product/')[1]?.replace(/\/$/, '')
                  return (
                    <div key={it.key} className="ci grid-cols-1 items-center gap-6 lg:grid-cols-[120px_1fr_auto_auto]">
                      {img ? <img src={img.thumbnail || img.src} alt={img.alt || ''} loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                      <div>
                        <div className="nm text-[17px]">{slug ? <Link to={`/product/${slug}`} className="no-underline">{stripHtml(it.name)}</Link> : stripHtml(it.name)}</div>
                        {it.variation?.length > 0 && <div className="meta">{it.variation.map(v => v.value).join(' · ')}</div>}
                        <div className="mt-3 flex items-center gap-4">
                          <button className="btn btn-ghost h-8 p-0 text-sm leading-[22px]" onClick={() => remove.mutate(it.key)}>Remove</button>
                        </div>
                      </div>
                      <div className="qty">
                        <button aria-label="Decrease quantity" disabled={busy || it.quantity <= 1} onClick={() => update.mutate({ key: it.key, quantity: it.quantity - 1 })}>−</button>
                        <span>{it.quantity}</span>
                        <button aria-label="Increase quantity" disabled={busy || it.quantity >= it.quantity_limits.maximum} onClick={() => update.mutate({ key: it.key, quantity: it.quantity + 1 })}>+</button>
                      </div>
                      <b className="price min-w-[90px] text-right">{formatPrice(it.totals.line_subtotal, it.totals)}</b>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link className="btn btn-ghost" to="/shop">Continue shopping</Link>
              </div>
            </div>

            <div className="sum">
              <h3 className="h4">Order summary</h3>
              <form className="mt-4 flex items-center gap-2" onSubmit={e => { e.preventDefault(); if (code.trim()) applyCoupon.mutate(code.trim(), { onSuccess: () => setCode('') }) }}>
                <input className="input h-11" placeholder="Coupon code" value={code} onChange={e => setCode(e.target.value)} aria-label="Coupon code" />
                <button className="btn btn-secondary btn-sm" disabled={applyCoupon.isPending}>Apply</button>
              </form>
              {cart.coupons?.map(c => (
                <p key={c.code} className="mt-2 flex items-center justify-between text-sm leading-[22px]">
                  <span>Coupon <b>{c.code}</b></span>
                  <button className="text-ink-muted underline" onClick={() => removeCoupon.mutate(c.code)}>Remove</button>
                </p>
              ))}
              <div className="mt-4">
                <div className="sum-r"><span>Subtotal</span><span>{formatPrice(t.total_items, t)}</span></div>
                <div className="sum-r"><span>Shipping</span><span>{cart.needs_shipping ? 'Calculated at checkout' : 'Not needed'}</span></div>
                <div className="sum-r"><span>Discount</span><span className="disc">−{formatPrice(discount, t)}</span></div>
                <div className="sum-r tot"><span>Total</span><span>{formatPrice(Number(t.total_price) - Number(t.total_shipping || 0), t)}</span></div>
              </div>
              <Link className="btn btn-primary btn-lg btn-block mt-6" to="/checkout">Proceed to checkout</Link>
              <p className="mt-3 text-center text-xs leading-[18px] text-ink-muted">Taxes and shipping are shown at checkout.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION} bg-surface-warm`}>
        <div className={WRAP}>
          <div className="mb-10">
            <span className="font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong">Complete the look</span>
            <h2 className="h2 mt-2">Recommended for you</h2>
          </div>
          <ProductGrid products={more?.items} loading={moreLoading} />
        </div>
      </section>
    </Layout>
  )
}
