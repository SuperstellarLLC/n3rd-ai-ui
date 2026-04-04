import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Alert, Progress, Skeleton, ToastProvider, useToast } from '../../src'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('has role=alert', () => {
    render(<Alert>msg</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows icon for each variant', () => {
    const { rerender } = render(<Alert variant="success">ok</Alert>)
    expect(screen.getByRole('alert').textContent).toContain('[✓]')

    rerender(<Alert variant="warning">warn</Alert>)
    expect(screen.getByRole('alert').textContent).toContain('[!]')

    rerender(<Alert variant="error">err</Alert>)
    expect(screen.getByRole('alert').textContent).toContain('[✗]')

    rerender(<Alert variant="info">info</Alert>)
    expect(screen.getByRole('alert').textContent).toContain('[i]')
  })

  it('has displayName', () => {
    expect(Alert.displayName).toBe('Alert')
  })
})

describe('Progress', () => {
  it('renders progress bar', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows percentage label', () => {
    render(<Progress value={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('hides label when showLabel=false', () => {
    render(<Progress value={50} showLabel={false} />)
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('clamps at 0%', () => {
    render(<Progress value={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('clamps at 100%', () => {
    render(<Progress value={200} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('handles max=0 without NaN', () => {
    render(<Progress value={5} max={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('has aria attributes', () => {
    render(<Progress value={30} max={50} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '50')
  })

  it('renders filled and empty blocks', () => {
    const { container } = render(<Progress value={50} width={10} />)
    const text = container.textContent ?? ''
    expect(text).toContain('█')
    expect(text).toContain('░')
  })

  it('has displayName', () => {
    expect(Progress.displayName).toBe('Progress')
  })
})

describe('Skeleton', () => {
  it('renders placeholder blocks', () => {
    const { container } = render(<Skeleton />)
    expect(container.textContent).toContain('░')
  })

  it('renders multiple lines', () => {
    const { container } = render(<Skeleton lines={3} />)
    const divs = container.querySelectorAll('[aria-busy] > div')
    expect(divs).toHaveLength(3)
  })

  it('last line is shorter', () => {
    const { container } = render(<Skeleton width={20} lines={2} />)
    const divs = container.querySelectorAll('[aria-busy] > div')
    const lastLine = (divs[1].textContent ?? '').length
    const firstLine = (divs[0].textContent ?? '').length
    expect(lastLine).toBeLessThan(firstLine)
  })

  it('has aria-busy', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy()
  })

  it('has displayName', () => {
    expect(Skeleton.displayName).toBe('Skeleton')
  })
})

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  function ToastTester() {
    const toast = useToast()
    return (
      <>
        <button onClick={() => toast.success('done')}>success</button>
        <button onClick={() => toast.error('fail')}>error</button>
        <button onClick={() => toast.warning('warn')}>warning</button>
        <button onClick={() => toast.info('note')}>info</button>
      </>
    )
  }

  it('shows toast on trigger', () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>,
    )
    act(() => {
      screen.getByText('success').click()
    })
    expect(screen.getByText('done')).toBeInTheDocument()
  })

  it('auto-dismisses after duration', () => {
    render(
      <ToastProvider duration={1000}>
        <ToastTester />
      </ToastProvider>,
    )
    act(() => {
      screen.getByText('success').click()
    })
    expect(screen.getByText('done')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(screen.queryByText('done')).not.toBeInTheDocument()
  })

  it('shows correct icons', () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>,
    )
    act(() => screen.getByText('success').click())
    expect(screen.getByText('[✓]')).toBeInTheDocument()
    act(() => screen.getByText('error').click())
    expect(screen.getByText('[✗]')).toBeInTheDocument()
  })

  it('limits to 5 toasts', () => {
    function ManyToasts() {
      const toast = useToast()
      return <button onClick={() => toast.info('msg')}>add</button>
    }

    render(
      <ToastProvider duration={60000}>
        <ManyToasts />
      </ToastProvider>,
    )

    for (let i = 0; i < 8; i++) {
      act(() => screen.getByText('add').click())
    }
    // Should only show 5
    expect(screen.getAllByText('msg')).toHaveLength(5)
  })

  it('throws when useToast is used outside provider', () => {
    function Bad() {
      useToast()
      return null
    }
    expect(() => render(<Bad />)).toThrow(/ToastProvider/)
  })

  it('has displayName', () => {
    expect(ToastProvider.displayName).toBe('ToastProvider')
  })
})
