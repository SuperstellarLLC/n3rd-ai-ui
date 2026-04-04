'use client'

import { type CSSProperties, type ChangeEvent, useState, useRef } from 'react'
import { Cursor } from '../../primitives/cursor'
import type { CursorStyle } from '../../primitives/cursor'
import './Input.css'

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  prefix?: string
  cursor?: CursorStyle
  type?: 'text' | 'email' | 'password' | 'url' | 'number'
  disabled?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  autoComplete?: string
  className?: string
  style?: CSSProperties
  name?: string
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

export function Input({
  label,
  placeholder,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSubmit,
  prefix = '>',
  cursor = 'block',
  type = 'text',
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  autoComplete,
  className,
  style,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const value = controlledValue ?? internalValue
  const errorId = errorMessage && id ? `${id}-error` : undefined

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (controlledValue === undefined) setInternalValue(val)
    onChange?.(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value)
    }
  }

  const fieldClasses = [
    'n3rd-input-field',
    focused ? 'n3rd-input-field-focused' : '',
    disabled ? 'n3rd-input-field-disabled' : '',
    error ? 'n3rd-input-field-error' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`n3rd-input-wrapper ${className ?? ''}`} style={style}>
      {label && (
        <label className="n3rd-input-label" htmlFor={id}>
          {label}:{required && ' *'}
        </label>
      )}
      <div className={fieldClasses} onClick={() => inputRef.current?.focus()}>
        {prefix && <span className="n3rd-input-prefix">{prefix}</span>}
        <div className="n3rd-input-wrap">
          <input
            ref={inputRef}
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            aria-label={ariaLabel}
            aria-invalid={error || undefined}
            aria-describedby={errorId ?? ariaDescribedBy}
            className="n3rd-input"
          />
          {focused && !disabled && <Cursor style={cursor} />}
        </div>
      </div>
      {error && errorMessage && (
        <div id={errorId} className="n3rd-input-error-message" role="alert">
          [✗] {errorMessage}
        </div>
      )}
    </div>
  )
}

Input.displayName = 'Input'
