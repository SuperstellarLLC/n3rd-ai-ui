import type { CSSProperties } from 'react'
import type { BorderStyle } from '../../primitives/ascii-border'
import { getBorderChars } from '../../primitives/ascii-border'

type Accent = 'primary' | 'success' | 'warning' | 'danger' | 'info'

type CellValue = string | { text: string; accent?: Accent }

export interface TableProps {
  columns: string[]
  rows: CellValue[][]
  border?: BorderStyle
  className?: string
  style?: CSSProperties
}

function getCellText(cell: CellValue): string {
  return typeof cell === 'string' ? cell : cell.text
}

function getCellAccent(cell: CellValue): Accent | undefined {
  return typeof cell === 'string' ? undefined : cell.accent
}

export function Table({ columns, rows, border = 'single', className, style }: TableProps) {
  const chars = getBorderChars(border)

  const tableStyle: CSSProperties = {
    fontFamily: 'var(--n3rd-font)',
    fontSize: 'var(--n3rd-text-sm)',
    color: 'var(--n3rd-border-default)',
    width: '100%',
    whiteSpace: 'pre',
    ...style,
  }

  if (!chars) {
    return (
      <table className={className} style={{ ...tableStyle, color: 'var(--n3rd-text-primary)' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                style={{
                  textAlign: 'left',
                  padding: 'var(--n3rd-space-2)',
                  color: 'var(--n3rd-text-secondary)',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: 'var(--n3rd-space-2)',
                    color: getCellAccent(cell)
                      ? `var(--n3rd-accent-${getCellAccent(cell)})`
                      : 'var(--n3rd-text-primary)',
                  }}
                >
                  {getCellText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Calculate column widths
  const colWidths = columns.map((col, i) => {
    let max = col.length
    for (const row of rows) {
      if (row[i]) {
        max = Math.max(max, getCellText(row[i]).length)
      }
    }
    return max + 2 // padding
  })

  const pad = (text: string, width: number) =>
    ` ${text}${' '.repeat(Math.max(0, width - text.length - 1))}`
  const line = (left: string, mid: string, right: string, fill: string) =>
    left + colWidths.map((w) => fill.repeat(w)).join(mid) + right

  const headerRow =
    chars.vertical +
    columns.map((col, i) => pad(col, colWidths[i])).join(chars.vertical) +
    chars.vertical

  return (
    <div className={className} style={tableStyle}>
      <div>{line(chars.topLeft, chars.teeTop, chars.topRight, chars.horizontal)}</div>
      <div style={{ color: 'var(--n3rd-text-secondary)' }}>{headerRow}</div>
      <div>{line(chars.teeLeft, chars.cross, chars.teeRight, chars.horizontal)}</div>
      {rows.map((row, i) => (
        <div key={i}>
          {chars.vertical}
          {row.map((cell, j) => {
            const text = getCellText(cell)
            const accent = getCellAccent(cell)
            const content = pad(text, colWidths[j])
            return (
              <span key={j}>
                {accent ? (
                  <span style={{ color: `var(--n3rd-accent-${accent})` }}>{content}</span>
                ) : (
                  <span style={{ color: 'var(--n3rd-text-primary)' }}>{content}</span>
                )}
                {j < row.length - 1 ? chars.vertical : ''}
              </span>
            )
          })}
          {chars.vertical}
        </div>
      ))}
      <div>{line(chars.bottomLeft, chars.teeBottom, chars.bottomRight, chars.horizontal)}</div>
    </div>
  )
}
