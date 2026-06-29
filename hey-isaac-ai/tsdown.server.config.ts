import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'server/server.ts' },
  format: ['esm'],
  outDir: 'build',
  dts: false,
  clean: true,
  external: ['@databricks/appkit'],
});
