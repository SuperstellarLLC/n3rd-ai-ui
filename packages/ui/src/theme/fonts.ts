/**
 * Font-family value matching the --n3rd-font CSS variable.
 * Use this when you need to reference the font stack in JS.
 *
 * For most use cases, just import a theme preset CSS:
 *   import '@n3rd-ai/ui/theme/unicorn.css'
 *   import '@n3rd-ai/ui/theme/fonts.css'   // optional: loads JetBrains Mono from CDN
 *
 * The CSS variable --n3rd-font is set globally by tokens.css.
 */
export const N3RD_FONT_FAMILY =
  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', 'Courier New', monospace"

/**
 * @deprecated No longer needed — theme presets apply the font via CSS variables.
 * Kept for backwards compatibility with v0.1.x.
 */
export const N3rdFonts = {
  className: '',
  variable: '--n3rd-font',
  style: { fontFamily: N3RD_FONT_FAMILY },
}

/** @deprecated Use N3RD_FONT_FAMILY instead. */
export const jetbrainsMono = N3rdFonts
