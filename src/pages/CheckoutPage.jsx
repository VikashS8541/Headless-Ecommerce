import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import CheckoutLayout from '../components/layout/CheckoutLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth, useCart, useCartActions } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { formatPrice, stripHtml } from '../lib/format.js'
import { INDIA_STATES } from '../lib/india.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'

const Step = ({ n, title }) => (
  <div className="step my-8 mb-5"><b>{n}</b><h2 className="h4">{title}</h2></div>
)

// DEMO payment methods. The ids match the demo gateways in WordPress (aurelo-demo-payments.php).
const PAYMENTS = [
  { id: 'aurelo_upi', label: 'UPI', hint: 'Pay with any UPI app' },
  { id: 'aurelo_card', label: 'Credit / debit card', hint: 'Visa, Mastercard, RuPay' },
  { id: 'aurelo_netbanking', label: 'Netbanking', hint: 'All major banks' },
  { id: 'aurelo_cod', label: 'Cash on delivery', hint: 'Pay when it arrives' },
]

const EMPTY = { email: '', first_name: '', last_name: '', phone: '', address_1: '', city: '', state: '', postcode: '' }

function validate(f) {
  const e = {}
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.'
  if (!f.first_name.trim()) e.first_name = 'Enter your first name.'
  if (!f.last_name.trim()) e.last_name = 'Enter your last name.'
  if (!/^\d{10}$/.test(f.phone.replace(/\D/g, '').slice(-10)) || f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit mobile number.'
  if (!f.address_1.trim()) e.address_1 = 'Enter your street address.'
  if (!f.city.trim()) e.city = 'Enter your city.'
  if (!f.state) e.state = 'Choose your state.'
  if (!/^\d{6}$/.test(f.postcode.trim())) e.postcode = 'Enter a valid 6-digit PIN code.'
  return e
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: cart, isLoading } = useCart()
  const { setCustomer, selectRate, checkout } = useCartActions()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('aurelo_upi')
  const [note, setNote] = useState('')

  // Pre-fill from the customer's account once it has loaded
  const [prefilled, setPrefilled] = useState(false)
  if (user && !prefilled) {
    setPrefilled(true)
    setForm(f => ({
      ...f,
      email: user.email || '', first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '',
      address_1: user.address?.address_1 || '', city: user.address?.city || '', state: user.address?.state || '', postcode: user.address?.postcode || '',
    }))
  }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const addr = () => ({ ...form, country: 'IN' })

  // Shipping prices depend on the address, so ask WooCommerce once the address is complete
  const refreshRates = () => {
    if (Object.keys(validate(form)).length === 0) setCustomer.mutate({ billing: addr(), shipping: addr() })
  }

  if (isLoading) return <CheckoutLayout><section className={`${WRAP} py-12`}><div className="sk h-64" /></section></CheckoutLayout>
  if (!cart?.items?.length) {
    return (
      <CheckoutLayout>
        <section className={`${WRAP} py-16`}>
          <EmptyState icon="bag" kind="cart_empty" actionTo="/shop" />
        </section>
      </CheckoutLayout>
    )
  }

  const t = cart.totals
  const pkg = cart.shipping_rates?.[0]
  const rates = pkg?.shipping_rates || []
  const selected = rates.find(r => r.selected)
  const submitError = checkout.error ? errorMessage(checkout.error) : ''
  const hasErrors = Object.keys(errors).length > 0

  const submit = async e => {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      // Make sure WooCommerce has the address (and therefore the shipping rates) before ordering
      await setCustomer.mutateAsync({ billing: addr(), shipping: addr() })
      const res = await checkout.mutateAsync({
        billing_address: addr(),
        shipping_address: addr(),
        customer_note: note,
        payment_method: payment,
      })
      navigate(`/order-success?order=${res.order_id}&key=${encodeURIComponent(res.order_key)}&email=${encodeURIComponent(form.email)}&pay=${payment}`)
    } catch { /* the message is shown from checkout.error */ }
  }

  return (
    <CheckoutLayout>
      <form onSubmit={submit} noValidate className={`${WRAP} pb-16 pt-8 lg:pb-24 lg:pt-12`}>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            {(hasErrors || submitError) && (
              <div className="alert err" role="alert">
                <div>
                  <b>{hasErrors ? `Please fix ${Object.keys(errors).length} field${Object.keys(errors).length > 1 ? 's' : ''}` : 'We could not place your order'}</b>
                  <br />{hasErrors ? 'Check the highlighted fields to continue.' : submitError}
                </div>
              </div>
            )}

            <Step n="1" title="Contact" />
            <Field label="Email address" error={errors.email}>
              <input className={`input ${errors.email ? 'is-error' : ''}`} type="email" autoComplete="email" value={form.email} onChange={set('email')} />
            </Field>

            <Step n="2" title="Shipping address" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="First name" error={errors.first_name}><input className={`input ${errors.first_name ? 'is-error' : ''}`} autoComplete="given-name" value={form.first_name} onChange={set('first_name')} /></Field>
              <Field label="Last name" error={errors.last_name}><input className={`input ${errors.last_name ? 'is-error' : ''}`} autoComplete="family-name" value={form.last_name} onChange={set('last_name')} /></Field>
              <Field label="Mobile number" error={errors.phone} className="md:col-span-2"><input className={`input ${errors.phone ? 'is-error' : ''}`} inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></Field>
              <Field label="Country" className="md:col-span-2"><select className="select" value="IN" disabled><option value="IN">India</option></select></Field>
              <Field label="Street address" error={errors.address_1} className="md:col-span-2"><input className={`input ${errors.address_1 ? 'is-error' : ''}`} autoComplete="address-line1" value={form.address_1} onChange={set('address_1')} /></Field>
              <Field label="City" error={errors.city}><input className={`input ${errors.city ? 'is-error' : ''}`} autoComplete="address-level2" value={form.city} onChange={set('city')} /></Field>
              <Field label="State" error={errors.state}>
                <select className={`select ${errors.state ? 'is-error' : ''}`} value={form.state} onChange={set('state')} onBlur={refreshRates}>
                  <option value="">Select state</option>
                  {INDIA_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </Field>
              <Field label="PIN code" error={errors.postcode}><input className={`input ${errors.postcode ? 'is-error' : ''}`} inputMode="numeric" autoComplete="postal-code" value={form.postcode} onChange={set('postcode')} onBlur={refreshRates} /></Field>
            </div>

            <Step n="3" title="Shipping method" />
            {rates.length === 0 ? (
              <p className="text-sm leading-[22px] text-ink-muted">Enter your address above to see delivery options.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {rates.map(r => (
                  <label key={r.rate_id} className="card flex cursor-pointer items-center justify-between gap-3 !p-4">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="rate" checked={!!r.selected} onChange={() => selectRate.mutate({ packageId: pkg.package_id, rateId: r.rate_id })} />
                      <span>{stripHtml(r.name)}</span>
                    </span>
                    <b>{Number(r.price) === 0 ? 'Free' : formatPrice(r.price, r)}</b>
                  </label>
                ))}
              </div>
            )}

            <Step n="4" title="Payment" />
            <div className="alert ok mb-4" role="note"><div><b>Demo mode</b><br />No real payment is taken. Pick any method and any values; the order is created as if it was paid.</div></div>
            <div className="flex flex-col gap-3">
              {PAYMENTS.map(p => (
                <div key={p.id} className="card !p-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                      <span>{p.label}</span>
                    </span>
                    <span className="text-xs leading-[18px] text-ink-muted">{p.hint}</span>
                  </label>
                  {payment === p.id && p.id === 'aurelo_upi' && (
                    <input className="input mt-3" placeholder="name@upi (optional, demo)" aria-label="UPI ID" />
                  )}
                  {payment === p.id && p.id === 'aurelo_card' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <input className="input col-span-2" inputMode="numeric" placeholder="Card number (demo)" aria-label="Card number" autoComplete="off" />
                      <input className="input" placeholder="MM / YY" aria-label="Expiry" autoComplete="off" />
                      <input className="input" placeholder="CVV" aria-label="CVV" autoComplete="off" />
                    </div>
                  )}
                  {payment === p.id && p.id === 'aurelo_netbanking' && (
                    <select className="select mt-3" aria-label="Bank" defaultValue="">
                      <option value="">Choose your bank (demo)</option>
                      <option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option>
                    </select>
                  )}
                </div>
              ))}
              <p className="text-xs leading-[18px] text-ink-muted">Card and bank details above are never sent anywhere. They are only for the demo.</p>
            </div>

            <Field label="Order note (optional)" className="mt-8">
              <textarea className="textarea" rows="3" value={note} onChange={e => setNote(e.target.value)} />
            </Field>
          </div>

          <aside className="sum lg:sticky lg:top-6">
            <h3 className="h4">Order summary</h3>
            <div className="mt-4">
              {cart.items.map(it => {
                const img = it.images?.[0]
                return (
                  <div key={it.key} className="ci grid-cols-[72px_1fr_auto] !py-4">
                    {img ? <img src={img.thumbnail || img.src} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                    <div>
                      <div className="nm text-sm leading-[22px]">{stripHtml(it.name)}</div>
                      <div className="meta">{[...(it.variation || []).map(v => v.value), `×${it.quantity}`].join(' · ')}</div>
                    </div>
                    <b className="text-sm leading-[22px]">{formatPrice(it.totals.line_subtotal, it.totals)}</b>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <div className="sum-r"><span>Subtotal</span><span>{formatPrice(t.total_items, t)}</span></div>
              <div className="sum-r"><span>Shipping</span><span>{selected ? (Number(selected.price) === 0 ? 'Free' : formatPrice(selected.price, selected)) : '—'}</span></div>
              {Number(t.total_discount) > 0 && <div className="sum-r"><span>Discount</span><span className="disc">−{formatPrice(t.total_discount, t)}</span></div>}
              <div className="sum-r tot"><span>Total</span><span>{formatPrice(t.total_price, t)}</span></div>
            </div>
            <button className={`btn btn-primary btn-lg btn-block mt-6 ${checkout.isPending ? 'is-loading' : ''}`} disabled={checkout.isPending}>
              {checkout.isPending ? 'Placing order' : `Place order · ${formatPrice(t.total_price, t)}`}
            </button>
            <p className="mt-4 text-center text-xs leading-[18px] text-ink-muted">By placing your order you agree to our <Link to="/policies/terms">terms</Link>.</p>
          </aside>
        </div>
      </form>
    </CheckoutLayout>
  )
}
