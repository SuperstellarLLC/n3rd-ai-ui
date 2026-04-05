# @n3rd-ai/ui

## 0.4.3

### Fixed

- `--n3rd-text-tertiary` bumped from `#555555` (3.4:1 contrast) to `#808080` (5.3:1) for WCAG AA compliance against the default `#0a0a0a` background

## 0.4.2

### Changed

- Sunset component max-width tightened from 480px to 350px
- Added integration smoke test rendering all 30 components together

## 0.4.1

### Added

- Comprehensive test suite (229 tests, 99.5% coverage)

## 0.4.0

### Added

- Initial component library: Box, Stack, Row, Grid, Divider, Page
- Display components: Text, Heading, Badge, Metric, Table, Code, List, Logo, StatusLine, Footer
- Input components: Button, Input
- Feedback components: Toast, Alert, Progress, Skeleton
- Nav component
- Theme system with 4 presets: unicorn, classic, retro, paper
- CSS custom properties for full theme customization
- Primitives: ascii-border, cursor, typewriter, scanline
- Hooks: useTypewriter, useKeyboard, useToast
- Utility functions: drawBox, formatTable
- N3rdProvider with toast and scanline support
