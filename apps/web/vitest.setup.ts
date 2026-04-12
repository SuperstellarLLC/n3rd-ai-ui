import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

vi.mock('next/font/google', () => {
  const font = () => ({
    className: '',
    style: { fontFamily: 'mock-font' },
    variable: 'mock-font-variable',
  })

  return {
    Space_Grotesk: font,
    Instrument_Serif: font,
  }
})
