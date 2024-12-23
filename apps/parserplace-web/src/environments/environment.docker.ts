import {EnvironmentModel} from './environment.model.js'

const withDefault = (val: string, def: string) => val || def

export const environment: EnvironmentModel = {
  production: true,
  hmr: false,
  baseImageUrl: withDefault('${BASE_IMAGE_URL}', '/img'),
  enableLogging: true,
  enableErrorLogging: true,
  webSocketUrl: '${WEB_SOCKET_URL}',
}
