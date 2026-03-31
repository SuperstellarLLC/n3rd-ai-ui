import type { CSSProperties } from 'react'
import { Box } from '../layout/Box'
import type { BorderStyle } from '../../primitives/ascii-border'

export interface CodeProps {
  children: string
  title?: string
  prompt?: string
  showLineNumbers?: boolean
  border?: BorderStyle
  className?: string
  style?: CSSProperties
}

export function Code({
  children,
  title,
  prompt,
  showLineNumbers = false,
  border = 'single',
  className,
  style,
}: CodeProps) {
  const lines = children.split('\n')

  const codeStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-sm)',
    lineHeight: 'var(--n3rd-line-height)',
    ...style,
  }

  return (
    <Box border={border} title={title} padding="sm" className={className}>
      <pre style={codeStyle}>
        {lines.map((line, i) => (
          <div key={i}>
            {showLineNumbers && (
              <span
                style={{
                  color: 'var(--n3rd-text-tertiary)',
                  marginRight: 'var(--n3rd-space-3)',
                  userSelect: 'none',
                }}
              >
                {String(i + 1).padStart(3)}
              </span>
            )}
            {prompt && i === 0 && (
              <span style={{ color: 'var(--n3rd-accent-primary)' }}>{prompt} </span>
            )}
            <span style={{ color: 'var(--n3rd-text-primary)' }}>{line}</span>
          </div>
        ))}
      </pre>
    </Box>
  )
}

Code.displayName = 'Code'
