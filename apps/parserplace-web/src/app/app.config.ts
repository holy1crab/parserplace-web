import {provideAnimations} from '@angular/platform-browser/animations'
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core'
import {provideRouter} from '@angular/router'
import {provideHttpClient, withFetch} from '@angular/common/http'
// import {provideClientHydration, withEventReplay} from '@angular/platform-browser'
import {NG_EVENT_PLUGINS} from '@taiga-ui/event-plugins'
import {provideEnv} from '../environments/env.token.js'
import {appRoutes} from './app.routes.js'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // provideClientHydration(withEventReplay()), /* uncomment for ssr */
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    provideEnv(),
    NG_EVENT_PLUGINS,
  ],
}
