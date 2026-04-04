import { getBorderChars, type BorderStyle } from '../primitives/ascii-border'

export interface BoxOptions {
  border?: BorderStyle
  title?: string
  padding?: number
}

export function drawBox(content: string, options: BoxOptions = {}): string {
  const { border = 'single', title, padding = 1 } = options
  const chars = getBorderChars(border)
  if (!chars) return content

  const lines = content.split('\n')
  const maxLen = Math.max(...lines.map((l) => l.length), title ? title.length + 2 : 0)
  const innerWidth = maxLen + padding * 2

  const pad = ' '.repeat(padding)
  const emptyLine = chars.vertical + ' '.repeat(innerWidth) + chars.vertical

  let top: string
  if (title) {
    const titleStr = ` ${title} `
    const remaining = innerWidth - titleStr.length - 1
    top =
      chars.topLeft +
      chars.horizontal +
      titleStr +
      chars.horizontal.repeat(remaining) +
      chars.topRight
  } else {
    top = chars.topLeft + chars.horizontal.repeat(innerWidth) + chars.topRight
  }

  const bottom = chars.bottomLeft + chars.horizontal.repeat(innerWidth) + chars.bottomRight

  const body = lines.map((line) => {
    const padded = pad + line + ' '.repeat(maxLen - line.length) + pad
    return chars.vertical + padded + chars.vertical
  })

  const paddingLines = Array(padding).fill(emptyLine)

  return [top, ...paddingLines, ...body, ...paddingLines, bottom].join('\n')
}
