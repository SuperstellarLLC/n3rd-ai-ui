import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from './WaitlistForm'

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('submits successfully', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true, duplicate: false }), { status: 200 }),
    )

    render(<WaitlistForm />)

    await user.type(screen.getByLabelText(/Email/i), 'hello@example.com')
    await user.type(screen.getByLabelText(/First workflow to transform/i), 'Home search')
    await user.click(screen.getByRole('button', { name: /Join the waitlist/i }))

    await waitFor(() => {
      expect(screen.getByText(/You made the list/i)).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith(
      '/api/waitlist',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })

  it('shows the duplicate state', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200 }),
    )

    render(<WaitlistForm />)

    await user.type(screen.getByLabelText(/Email/i), 'repeat@example.com')
    await user.click(screen.getByRole('button', { name: /Join the waitlist/i }))

    await waitFor(() => {
      expect(screen.getByText(/already in/i)).toBeInTheDocument()
    })
  })

  it('shows an error message when the request fails', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: 'Try again later' }), { status: 503 }),
    )

    render(<WaitlistForm />)

    await user.type(screen.getByLabelText(/Email/i), 'hello@example.com')
    await user.click(screen.getByRole('button', { name: /Join the waitlist/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Try again later/i)
    })
  })
})
