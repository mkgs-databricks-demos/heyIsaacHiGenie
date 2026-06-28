import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'server/server.ts' },
  format: ['esm'],
  outDir: 'build',
  dts: false,
  clean: true,
  external: ['@ast-grep/napi-linux-x64-gnu', '@ast-grep/napi-linux-x64-musl'],
});
