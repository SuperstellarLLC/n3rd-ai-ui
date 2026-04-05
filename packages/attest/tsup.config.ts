import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: true,
  splitting: false,
  treeshake: true,
  clean: true,
  external: ['@n3rd-ai/mcp'],
})
