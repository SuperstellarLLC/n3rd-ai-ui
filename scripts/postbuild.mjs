/**
 * Post-build script — runs after tsup finishes.
 *
 * 1. Copies theme CSS to dist/theme/
 * 2. Injects "use client" directive into JS entry + chunks (not utils)
 * 3. Injects CSS import into the main entry
 *
 * Written in Node so it works on macOS, Linux, and Windows CI.
 */

import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const THEME_SRC = 'src/theme'
const THEME_DEST = join(DIST, 'theme')

// ── 1. Copy theme CSS ──────────────────────────────────────────────
rmSync(THEME_DEST, { recursive: true, force: true })
mkdirSync(join(THEME_DEST, 'presets'), { recursive: true })

for (const file of readdirSync(THEME_SRC)) {
  if (file.endsWith('.css')) {
    cpSync(join(THEME_SRC, file), join(THEME_DEST, file))
  }
}
for (const file of readdirSync(join(THEME_SRC, 'presets'))) {
  if (file.endsWith('.css')) {
    cpSync(join(THEME_SRC, 'presets', file), join(THEME_DEST, 'presets', file))
  }
}

// ── 2. Inject "use client" into JS files (skip utils) ──────────────
const jsFiles = [
  ...readdirSync(DIST).filter((f) => f.endsWith('.js')).map((f) => join(DIST, f)),
  ...readdirSync(join(DIST, 'hooks')).filter((f) => f.endsWith('.js')).map((f) => join(DIST, 'hooks', f)),
]

for (const file of jsFiles) {
  const content = readFileSync(file, 'utf8')
  if (!content.startsWith('"use client"')) {
    writeFileSync(file, `"use client";\n${content}`)
  }
}

// ── 3. Inject CSS import into main entry ────────────────────────────
const entryPath = join(DIST, 'index.js')
const entry = readFileSync(entryPath, 'utf8')
if (!entry.includes('import "./index.css"')) {
  const lines = entry.split('\n')
  // Insert after "use client" line
  const insertAt = lines[0].includes('use client') ? 1 : 0
  lines.splice(insertAt, 0, 'import "./index.css";')
  writeFileSync(entryPath, lines.join('\n'))
}

console.log('postbuild: injected "use client" + CSS import')
