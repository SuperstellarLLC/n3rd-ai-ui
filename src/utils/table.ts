import { getBorderChars, type BorderStyle } from '../primitives/ascii-border'

export interface FormatTableOptions {
  border?: BorderStyle
}

export function formatTable(
  columns: string[],
  rows: string[][],
  options: FormatTableOptions = {},
): string {
  const { border = 'single' } = options
  const chars = getBorderChars(border)
  if (!chars) {
    return [columns.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n')
  }

  const colWidths = columns.map((col, i) => {
    let max = col.length
    for (const row of rows) {
      if (row[i]) max = Math.max(max, row[i].length)
    }
    return max + 2
  })

  const pad = (text: string, width: number) =>
    ` ${text}${' '.repeat(Math.max(0, width - text.length - 1))}`
  const line = (left: string, mid: string, right: string, fill: string) =>
    left + colWidths.map((w) => fill.repeat(w)).join(mid) + right

  const header =
    chars.vertical +
    columns.map((col, i) => pad(col, colWidths[i])).join(chars.vertical) +
    chars.vertical
  const dataRows = rows.map(
    (row) =>
      chars.vertical +
      row.map((cell, i) => pad(cell, colWidths[i])).join(chars.vertical) +
      chars.vertical,
  )

  return [
    line(chars.topLeft, chars.teeTop, chars.topRight, chars.horizontal),
    header,
    line(chars.teeLeft, chars.cross, chars.teeRight, chars.horizontal),
    ...dataRows,
    line(chars.bottomLeft, chars.teeBottom, chars.bottomRight, chars.horizontal),
  ].join('\n')
}
