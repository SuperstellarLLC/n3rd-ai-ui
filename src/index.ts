// Global keyframes (cursor blink, fade-in, etc.)
import './globals.css'

// Layout (RSC — zero JS)
export { Box } from './components/layout/Box'
export type { BoxProps } from './components/layout/Box'
export { Stack } from './components/layout/Stack'
export type { StackProps } from './components/layout/Stack'
export { Row } from './components/layout/Row'
export type { RowProps } from './components/layout/Row'
export { Grid } from './components/layout/Grid'
export type { GridProps } from './components/layout/Grid'
export { Divider } from './components/layout/Divider'
export type { DividerProps } from './components/layout/Divider'
export { Page } from './components/layout/Page'
export type { PageProps } from './components/layout/Page'

// Display (RSC — zero JS)
export { Text } from './components/display/Text'
export type { TextProps } from './components/display/Text'
export { Heading } from './components/display/Heading'
export type { HeadingProps } from './components/display/Heading'
export { Badge } from './components/display/Badge'
export type { BadgeProps } from './components/display/Badge'
export { Metric } from './components/display/Metric'
export type { MetricProps } from './components/display/Metric'
export { Table } from './components/display/Table'
export type { TableProps } from './components/display/Table'
export { Code } from './components/display/Code'
export type { CodeProps } from './components/display/Code'
export { List } from './components/display/List'
export type { ListProps } from './components/display/List'
export { Logo } from './components/display/Logo'
export type { LogoProps } from './components/display/Logo'
export { StatusLine } from './components/display/StatusLine'
export type { StatusLineProps } from './components/display/StatusLine'
export { Footer } from './components/display/Footer'
export type { FooterProps } from './components/display/Footer'

// Input (Client — needs JS)
export { Button } from './components/input/Button'
export type { ButtonProps } from './components/input/Button'
export { Input } from './components/input/Input'
export type { InputProps } from './components/input/Input'

// Feedback (Client — needs JS)
export { Alert } from './components/feedback/Alert'
export type { AlertProps } from './components/feedback/Alert'
export { Progress } from './components/feedback/Progress'
export type { ProgressProps } from './components/feedback/Progress'
export { Skeleton } from './components/feedback/Skeleton'
export type { SkeletonProps } from './components/feedback/Skeleton'
export { ToastProvider, useToast } from './components/feedback/Toast'

// Nav (Hybrid)
export { Nav } from './components/nav/Nav'
export type { NavProps } from './components/nav/Nav'

// Primitives
export { Cursor } from './primitives/cursor'
export type { CursorStyle, CursorProps } from './primitives/cursor'
export { Typewriter } from './primitives/typewriter'
export type { TypewriterProps } from './primitives/typewriter'
export { Scanline } from './primitives/scanline'
export type { ScanlineProps } from './primitives/scanline'
export { BORDER_CHARS, getBorderChars } from './primitives/ascii-border'
export type { BorderStyle } from './primitives/ascii-border'
export { renderAsciiText, renderAsciiLines } from './primitives/ascii-font'

// Provider
export { N3rdProvider } from './provider'
export type { N3rdProviderProps } from './provider'

// Theme / Fonts
export { N3rdFonts, jetbrainsMono, N3RD_FONT_FAMILY } from './theme/fonts'
