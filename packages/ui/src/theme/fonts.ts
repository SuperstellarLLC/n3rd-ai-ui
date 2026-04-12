/**
 * Font-family value matching the --boum-font CSS variable.
 * Use this when you need to reference the font stack in JS.
 *
 * For most use cases, just import a theme preset CSS:
 *   import '@boum-ai/ui/theme/unicorn.css'
 *   import '@boum-ai/ui/theme/fonts.css'   // optional: loads JetBrains Mono from CDN
 *
 * The CSS variable --boum-font is set globally by tokens.css.
 */
export const BOUM_FONT_FAMILY =
  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', 'Courier New', monospace"

/**
 * @deprecated No longer needed — theme presets apply the font via CSS variables.
 * Kept for backwards compatibility with v0.1.x.
 */
export const BoumFonts = {
  className: '',
  variable: '--boum-font',
  style: { fontFamily: BOUM_FONT_FAMILY },
}

/** @deprecated Use BOUM_FONT_FAMILY instead. */
export const N3RD_FONT_FAMILY = BOUM_FONT_FAMILY

/** @deprecated Use BoumFonts instead. */
export const N3rdFonts = BoumFonts

/** @deprecated Use BOUM_FONT_FAMILY instead. */
export const jetbrainsMono = BoumFonts
