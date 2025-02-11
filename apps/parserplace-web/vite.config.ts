/// <reference types='vitest' />
import {defineConfig} from 'vite'
import angular from '@analogjs/vite-plugin-angular'
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import {nxCopyAssetsPlugin} from '@nx/vite/plugins/nx-copy-assets.plugin'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    cacheDir: '../../node_modules/.vite/apps/parserplace-web',
    plugins: [angular(), nxViteTsPaths({extensions: ['.ts', '.js']}), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      // include: ['**/*.spec.ts'],
      // reporters: ['default'],
      reporters: ['verbose'],
      // inline @ngneat/spectator
      server: {
        deps: {
          inline: ['@ngneat/spectator'],
        },
      },
      coverage: {
        reportsDirectory: '../../coverage/apps/parserplace-web',
        provider: 'v8',
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  }
})
