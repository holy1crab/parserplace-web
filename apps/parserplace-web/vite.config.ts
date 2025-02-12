/// <reference types='vitest' />
import {defineConfig, searchForWorkspaceRoot} from 'vite'
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
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
    test: {
      // default is `threads` but it was crashing (segmentation fault code 139)
      // https://github.com/vitest-dev/vitest/issues/3143
      pool: 'forks',
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.spec.{js,ts}'],
      reporters: ['default'],
      server: {
        deps: {
          inline: ['@ngneat/spectator'],
        },
      },
      coverage: {
        reportsDirectory: '../../coverage/apps/parserplace-web',
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'clover'],
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  }
})
