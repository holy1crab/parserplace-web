import {InjectionToken, Provider, ValueProvider} from '@angular/core'
import {EnvironmentModel} from './environment.model.js'
import {environment} from './environment.js'

export const ENV_TOKEN = new InjectionToken<EnvironmentModel>('ENV_TOKEN')

export function provideEnv(): Provider {
  return {
    provide: ENV_TOKEN,
    useValue: environment,
    multi: false,
  } as ValueProvider
}
