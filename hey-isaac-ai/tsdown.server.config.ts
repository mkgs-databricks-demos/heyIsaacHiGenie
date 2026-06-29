import { defineConfig } from 'tsdown';

const AST_GREP_STUB_ID = '\0ast-grep-native-stub';

export default defineConfig({
  entry: { index: 'server/server.ts' },
  format: ['esm'],
  outDir: 'build',
  dts: false,
  clean: true,
  plugins: [
    {
      name: 'stub-ast-grep-native',
      resolveId(id: string) {
        // Stub ALL @ast-grep/napi-* platform binary packages
        if (id.match(/^@ast-grep\/napi-/)) {
          return AST_GREP_STUB_ID;
        }
      },
      load(id: string) {
        if (id === AST_GREP_STUB_ID) {
          // Empty object: makes @ast-grep/napi think nativeBinding loaded OK
          return 'export default {};';
        }
      },
    },
  ],
});
