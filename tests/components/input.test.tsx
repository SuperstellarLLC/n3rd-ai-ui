import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button, Input } from '../../src'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click')
  })

  it('renders as button by default', () => {
    render(<Button>btn</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as link when href provided', () => {
    render(<Button href="/test">link</Button>)
    const a = screen.getByRole('link')
    expect(a).toHaveAttribute('href', '/test')
  })

  it('sets external link attributes', () => {
    render(
      <Button href="https://example.com" external>
        ext
      </Button>,
    )
    const a = screen.getByRole('link')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows brackets for non-ghost variants', () => {
    render(<Button>text</Button>)
    expect(screen.getByRole('button').textContent).toContain('[')
    expect(screen.getByRole('button').textContent).toContain(']')
  })

  it('no brackets for ghost variant', () => {
    render(<Button variant="ghost">text</Button>)
    expect(screen.getByRole('button').textContent).not.toContain('[')
  })

  it('disables button when disabled', () => {
    render(<Button disabled>btn</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables button when loading', () => {
    render(<Button loading>btn</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument()
  })

  it('fires onClick', () => {
    const fn = vi.fn()
    render(<Button onClick={fn}>btn</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('applies aria-label', () => {
    render(<Button aria-label="close">×</Button>)
    expect(screen.getByLabelText('close')).toBeInTheDocument()
  })

  it('has displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<Input label="Name" id="name" />)
    expect(screen.getByText('Name:')).toBeInTheDocument()
  })

  it('renders prefix', () => {
    render(<Input prefix="$" />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('handles controlled value', () => {
    const fn = vi.fn()
    render(<Input value="hello" onChange={fn} />)
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('handles uncontrolled with defaultValue', () => {
    render(<Input defaultValue="default" />)
    expect(screen.getByRole('textbox')).toHaveValue('default')
  })

  it('calls onChange', () => {
    const fn = vi.fn()
    render(<Input onChange={fn} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(fn).toHaveBeenCalledWith('test')
  })

  it('calls onSubmit on Enter', () => {
    const fn = vi.fn()
    render(<Input onSubmit={fn} defaultValue="hello" />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(fn).toHaveBeenCalledWith('hello')
  })

  it('sets disabled attribute', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('sets required attribute', () => {
    render(<Input required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('shows required indicator in label', () => {
    render(<Input label="Email" id="email" required />)
    expect(screen.getByText(/Email:.*\*/)).toBeTruthy()
  })

  it('applies error state', () => {
    const { container } = render(<Input error errorMessage="Required field" id="test" />)
    expect(screen.getByText(/Required field/)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    expect(container.querySelector('.n3rd-input-field-error')).toBeTruthy()
  })

  it('error message has alert role', () => {
    render(<Input error errorMessage="Bad" id="test" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Bad')
  })

  it('links error to input via aria-describedby', () => {
    render(<Input error errorMessage="Bad" id="myinput" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'myinput-error')
  })

  it('has displayName', () => {
    expect(Input.displayName).toBe('Input')
  })
})
