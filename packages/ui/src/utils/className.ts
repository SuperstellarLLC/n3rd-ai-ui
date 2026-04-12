export function legacyClassName(...values: Array<string | false | null | undefined>) {
  const classes = new Set<string>()

  for (const value of values) {
    if (!value) continue

    for (const token of value.split(/\s+/)) {
      if (!token) continue

      classes.add(token)

      if (token.includes('boum-')) {
        classes.add(token.replace(/\bboum-/g, 'n3rd-'))
      }
    }
  }

  return Array.from(classes).join(' ')
}
