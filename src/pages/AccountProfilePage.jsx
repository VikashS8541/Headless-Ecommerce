import { useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { INDIA_STATES } from '../lib/india.js'

/** The form starts from the saved details; `key` in the parent resets it when they change. */
function ProfileForms({ user }) {
  const { updateProfile, changePassword } = useAuth()
  const [p, setP] = useState({
    first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '', phone: user.phone || '',
    ...{ address_1: user.address?.address_1 || '', city: user.address?.city || '', state: user.address?.state || '', postcode: user.address?.postcode || '' },
  })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState('')
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })
  const set = k => e => setP(s => ({ ...s, [k]: e.target.value }))

  const saveProfile = e => {
    e.preventDefault()
    setSaved('')
    updateProfile.mutate(
      { first_name: p.first_name, last_name: p.last_name, email: p.email, phone: p.phone, address: { address_1: p.address_1, city: p.city, state: p.state, postcode: p.postcode, country: 'IN' } },
      { onSuccess: () => setSaved('Your details were saved.') },
    )
  }

  const savePassword = e => {
    e.preventDefault()
    if (pw.next.length < 8) return setPwMsg({ type: 'err', text: 'Use at least 8 characters for the new password.' })
    if (pw.next !== pw.confirm) return setPwMsg({ type: 'err', text: 'The new passwords do not match.' })
    setPwMsg({ type: '', text: '' })
    changePassword.mutate({ current: pw.current, new: pw.next }, {
      onSuccess: () => { setPw({ current: '', next: '', confirm: '' }); setPwMsg({ type: 'ok', text: 'Your password was updated.' }) },
      onError: err => setPwMsg({ type: 'err', text: errorMessage(err) }),
    })
  }

  return (
    <>
      <form onSubmit={saveProfile} className="card mt-6 flex flex-col gap-5">
        <h3 className="h4">Edit profile</h3>
        {updateProfile.isError && <div className="alert err" role="alert"><div>{errorMessage(updateProfile.error)}</div></div>}
        {saved && <div className="alert ok" role="status"><div>{saved}</div></div>}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="First name"><input className="input" value={p.first_name} onChange={set('first_name')} /></Field>
          <Field label="Last name"><input className="input" value={p.last_name} onChange={set('last_name')} /></Field>
          <Field label="Email"><input className="input" type="email" value={p.email} onChange={set('email')} /></Field>
          <Field label="Phone"><input className="input" inputMode="tel" value={p.phone} onChange={set('phone')} /></Field>
        </div>

        <h3 className="h4 mt-4 scroll-mt-6" id="addresses">My addresses</h3>
        <p className="text-sm leading-[22px] text-ink-muted">Used to fill in checkout for you.</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Street address" className="md:col-span-2"><input className="input" value={p.address_1} onChange={set('address_1')} /></Field>
          <Field label="City"><input className="input" value={p.city} onChange={set('city')} /></Field>
          <Field label="State">
            <select className="select" value={p.state} onChange={set('state')}>
              <option value="">Select state</option>
              {INDIA_STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
            </select>
          </Field>
          <Field label="PIN code"><input className="input" inputMode="numeric" value={p.postcode} onChange={set('postcode')} /></Field>
        </div>
        <button className={`btn btn-primary self-start ${updateProfile.isPending ? 'is-loading' : ''}`} disabled={updateProfile.isPending}>Save changes</button>
      </form>

      <form onSubmit={savePassword} className="card mt-8 flex flex-col gap-5" id="password">
        <h3 className="h4 scroll-mt-6">Change password</h3>
        {pwMsg.text && <div className={`alert ${pwMsg.type}`} role={pwMsg.type === 'err' ? 'alert' : 'status'}><div>{pwMsg.text}</div></div>}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Current password"><input className="input" type="password" autoComplete="current-password" value={pw.current} onChange={e => setPw(s => ({ ...s, current: e.target.value }))} /></Field>
          <Field label="New password"><input className="input" type="password" autoComplete="new-password" value={pw.next} onChange={e => setPw(s => ({ ...s, next: e.target.value }))} /></Field>
          <Field label="Confirm new password"><input className="input" type="password" autoComplete="new-password" value={pw.confirm} onChange={e => setPw(s => ({ ...s, confirm: e.target.value }))} /></Field>
        </div>
        <button className={`btn btn-primary self-start ${changePassword.isPending ? 'is-loading' : ''}`} disabled={changePassword.isPending}>Update password</button>
      </form>
    </>
  )
}

export default function AccountProfilePage() {
  const { user } = useAuth()
  return (
    <AccountLayout>
      <h1 className="h2">My profile</h1>
      {user && <ProfileForms key={user.id + user.email + user.phone} user={user} />}
    </AccountLayout>
  )
}
