import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import Field from '../components/ui/Field.jsx'
import { forgotPassword } from '../api/account.js'
import { errorMessage } from '../api/errors.js'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const send = useMutation({ mutationFn: forgotPassword })

  const submit = e => { e.preventDefault(); if (email.trim()) send.mutate(email.trim()) }

  if (send.isSuccess) {
    return (
      <AuthLayout>
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-accent-soft text-accent-strong">
            <svg className="ic" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </div>
          <h2 className="h3">Check your inbox</h2>
          <p className="text-sm leading-[22px] text-ink-muted">If an account exists for <b>{email}</b>, we sent a link to choose a new password.</p>
          <Link className="btn btn-secondary" to="/login">Back to log in</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} className="card flex flex-col gap-4 p-8">
        <div><Logo /></div>
        <div>
          <h2 className="h3">Forgot password</h2>
          <p className="mt-2 text-sm leading-[22px] text-ink-muted">Enter your email and we will send a reset link.</p>
        </div>
        {send.isError && <div className="alert err" role="alert"><div>{errorMessage(send.error)}</div></div>}
        <Field label="Email"><input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></Field>
        <button className={`btn btn-primary btn-block ${send.isPending ? 'is-loading' : ''}`} disabled={send.isPending}>{send.isPending ? 'Sending' : 'Send reset link'}</button>
        <p className="text-center text-sm leading-[22px]"><Link to="/login">Back to log in</Link></p>
      </form>
    </AuthLayout>
  )
}
