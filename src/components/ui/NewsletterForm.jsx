import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { subscribe } from '../../api/account.js'
import { errorMessage } from '../../api/errors.js'

/** Email sign-up. Saved in WordPress under Subscribers. buttonClass picks the button style. */
export default function NewsletterForm({ buttonClass = 'btn btn-primary', buttonLabel = 'Subscribe', inputClass = 'input', className = '' }) {
  const [email, setEmail] = useState('')
  const sub = useMutation({ mutationFn: subscribe, onSuccess: () => setEmail('') })

  if (sub.isSuccess) return <p className={`text-sm leading-[22px] ${className}`} role="status">Thank you. You are on the list.</p>
  return (
    <form
      className={className}
      onSubmit={e => { e.preventDefault(); if (email.trim()) sub.mutate(email.trim()) }}
    >
      <div className="flex items-center gap-2">
        <input className={`${inputClass} h-11`} type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <button className={`${buttonClass} btn-sm`} disabled={sub.isPending}>{sub.isPending ? '…' : buttonLabel}</button>
      </div>
      {sub.isError && <p className="msg err mt-2" role="alert">{errorMessage(sub.error)}</p>}
    </form>
  )
}
