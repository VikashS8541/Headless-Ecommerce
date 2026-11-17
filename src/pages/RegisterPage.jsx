import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const set = k => e => setF(s => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = e => {
    e.preventDefault()
    const v = {}
    if (!f.name.trim()) v.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = 'Enter a valid email address.'
    if (f.password.length < 8) v.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) v.confirm = 'The passwords do not match.'
    if (!f.terms) v.terms = 'Please accept the terms to continue.'
    setErrors(v)
    setServerError('')
    if (Object.keys(v).length) return
    register.mutate({ name: f.name.trim(), email: f.email.trim(), password: f.password }, {
      onSuccess: () => navigate(state?.from || '/account', { replace: true }),
      onError: err => setServerError(errorMessage(err)),
    })
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="card flex flex-col gap-4 p-8">
        <div><Logo /></div>
        <div>
          <h2 className="h3">Create account</h2>
          <p className="mt-2 text-sm leading-[22px] text-ink-muted">Join for faster checkout and member offers.</p>
        </div>
        {serverError && <div className="alert err" role="alert"><div>{serverError}</div></div>}
        <Field label="Full name" error={errors.name}><input className={`input ${errors.name ? 'is-error' : ''}`} autoComplete="name" value={f.name} onChange={set('name')} /></Field>
        <Field label="Email" error={errors.email}><input className={`input ${errors.email ? 'is-error' : ''}`} type="email" autoComplete="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters"><input className={`input ${errors.password ? 'is-error' : ''}`} type="password" autoComplete="new-password" value={f.password} onChange={set('password')} /></Field>
        <Field label="Confirm password" error={errors.confirm}><input className={`input ${errors.confirm ? 'is-error' : ''}`} type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></Field>
        <div>
          <label className="chk"><input type="checkbox" checked={f.terms} onChange={set('terms')} />I agree to the <Link to="/policies/terms">Terms</Link> and <Link to="/policies/privacy">Privacy Policy</Link></label>
          {errors.terms && <span className="msg err mt-2" role="alert">{errors.terms}</span>}
        </div>
        <button className={`btn btn-primary btn-block ${register.isPending ? 'is-loading' : ''}`} disabled={register.isPending}>{register.isPending ? 'Creating account' : 'Create account'}</button>
        <p className="text-center text-sm leading-[22px] text-ink-muted">Already a member? <Link to="/login" state={state}>Log in</Link></p>
      </form>
    </AuthLayout>
  )
}
