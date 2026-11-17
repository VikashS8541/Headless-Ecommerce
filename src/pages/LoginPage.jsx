import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = e => {
    e.preventDefault()
    if (!email.trim() || !password) { setError('Enter your email and password.'); return }
    setError('')
    login.mutate({ email: email.trim(), password }, { onSuccess: () => navigate(from, { replace: true }), onError: err => setError(errorMessage(err)) })
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="card flex flex-col gap-4 p-8">
        <div><Logo /></div>
        <div>
          <h2 className="h3">Welcome back</h2>
          <p className="mt-2 text-sm leading-[22px] text-ink-muted">Sign in to track orders and save favourites.</p>
        </div>
        {error && <div className="alert err" role="alert"><div>{error}</div></div>}
        <Field label="Email"><input className="input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input className="input" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
        <div className="flex items-center justify-end">
          <Link className="text-sm leading-[22px]" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className={`btn btn-primary btn-block ${login.isPending ? 'is-loading' : ''}`} disabled={login.isPending}>{login.isPending ? 'Logging in' : 'Log in'}</button>
        <p className="text-center text-sm leading-[22px] text-ink-muted">New to Aurelo? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  )
}
