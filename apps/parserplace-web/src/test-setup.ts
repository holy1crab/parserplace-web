// import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone'
import '@analogjs/vitest-angular/setup-zone'

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'
import {getTestBed} from '@angular/core/testing'

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())

// setupZoneTestEnv({
//   errorOnUnknownElements: true,
//   errorOnUnknownProperties: true,
// })
