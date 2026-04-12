'use client'

import { useState, type FormEvent } from 'react'
import styles from '@/app/page.module.css'

interface WaitlistResponse {
  ok: boolean
  duplicate?: boolean
  error?: string
}

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'duplicate' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          useCase: useCase.trim(),
          source: 'landing-page',
        }),
      })

      const body = (await response.json().catch(() => null)) as WaitlistResponse | null

      if (!response.ok || !body?.ok) {
        setStatus('error')
        setMessage(body?.error ?? 'The waitlist request failed. Please try again in a moment.')
        return
      }

      if (body.duplicate) {
        setStatus('duplicate')
        setMessage('You are already on the list. We will reach out as soon as invites open.')
        return
      }

      setStatus('success')
      setMessage('You are in. We will send early access details as soon as the first invites open.')
      setEmail('')
      setUseCase('')
    } catch {
      setStatus('error')
      setMessage('The waitlist request failed. Please try again in a moment.')
    }
  }

  const isBusy = status === 'submitting'
  const isComplete = status === 'success' || status === 'duplicate'

  if (isComplete) {
    return (
      <div className={styles.successPanel} role="status" aria-live="polite">
        <span className={styles.successBadge}>Waitlist confirmed</span>
        <h3>{status === 'duplicate' ? 'You are already in.' : 'You made the list.'}</h3>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Email</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isBusy}
            required
          />
        </label>

        <label className={styles.field}>
          <span>First workflow to transform</span>
          <textarea
            className={styles.textarea}
            name="useCase"
            placeholder="Comparing apartment options, shopping research, travel planning, code review..."
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            disabled={isBusy}
            rows={5}
          />
        </label>
      </div>

      <div className={styles.formFooter}>
        <button className={styles.primaryButton} type="submit" disabled={isBusy}>
          {isBusy ? 'Joining...' : 'Join the waitlist'}
        </button>
        <p className={styles.helperText}>
          We are prioritizing early users with real comparison-heavy workflows.
        </p>
      </div>

      {status === 'error' ? (
        <p className={styles.formStatus} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  )
}
