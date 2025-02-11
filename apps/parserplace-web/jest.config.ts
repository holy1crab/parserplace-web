import {readFile} from 'fs/promises'
import {dirname, join} from 'path'
import presets from 'jest-preset-angular/presets'
import {pathsToModuleNameMapper, type JestConfigWithTsJest} from 'ts-jest'

async function getPaths(): Promise<Record<string, string[]>> {
  const pathsFile = join(dirname(dirname(__dirname)), 'tsconfig.base.json')
  const tsConfigData = JSON.parse(await readFile(pathsFile, {encoding: 'utf-8', flag: 'r'}))
  return tsConfigData?.compilerOptions?.paths || {}
}

export default async () => {
  const esmPreset = presets.createEsmPreset()

  console.log('refresh config')

  return {
    ...esmPreset,
    displayName: 'parserplace-web',
    moduleNameMapper: {
      ...esmPreset.moduleNameMapper,
      '^rxjs': '<rootDir>/../../node_modules/rxjs/dist/bundles/rxjs.umd.js',
      ...pathsToModuleNameMapper(await getPaths(), {prefix: '<rootDir>/../..', useESM: true}),
      // imports end with ".js" extension
      // '^(\\./.+|\\../.+|\\@pp/.+).js$': '$1',
    },
    moduleFileExtensions: ['ts', 'js'],
    extensionsToTreatAsEsm: ['.ts'],
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    // transformIgnorePatterns: [`node_modules/(?!@angular|@ngneat/spectator|tslib)`],
    transformIgnorePatterns: ['node_modules/(?!tslib)'],
    // explicitly copy here from preset
    transform: {
      '^.+\\.(ts|js|html|svg)$': [
        'jest-preset-angular',
        {
          tsconfig: '<rootDir>/tsconfig.spec.json',
          stringifyContentPathRegex: '\\.(html|svg)$',
          useESM: true,
        },
      ],
    },
  } satisfies JestConfigWithTsJest
}
