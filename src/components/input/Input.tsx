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
  className?: string
  style?: CSSProperties
  name?: string
  id?: string
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
  className,
  style,
  name,
  id,
}: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const value = controlledValue ?? internalValue

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
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`n3rd-input-wrapper ${className ?? ''}`} style={style}>
      {label && (
        <label className="n3rd-input-label" htmlFor={id}>
          {label}:
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
            className="n3rd-input"
          />
          {focused && !disabled && <Cursor style={cursor} />}
        </div>
      </div>
    </div>
  )
}
