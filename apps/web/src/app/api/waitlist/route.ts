import { NextResponse } from 'next/server'

const API_BASE =
  process.env.N3RD_API_URL ?? process.env.NEXT_PUBLIC_N3RD_API_URL ?? 'http://127.0.0.1:4001'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE}/v1/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            typeof data?.error === 'string'
              ? data.error
              : 'Unable to submit the waitlist request right now.',
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      ok: true,
      duplicate: data?.duplicate === true,
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to reach the waitlist service right now.',
      },
      { status: 503 },
    )
  }
}
