import mapObj, {Mapper} from 'map-obj'
import {snakeCase} from 'change-case'
import {isObject, matches} from './util.js'

export interface SnakecaseOptions {
  deep?: boolean
  exclude?: ReadonlyArray<string>
  stopPaths?: ReadonlyArray<string>
}

// https://github.com/bendrucker/snakecase-keys doesn't have stopPaths as camelcase-keys
export function snakecaseKeys(input: {[key: string]: any}, options?: SnakecaseOptions): any {
  options = {deep: false, exclude: [], stopPaths: [], ...options}

  const {deep, exclude} = options
  const stopPathsSet = new Set(options.stopPaths)

  const mapper = (parentPath: string | undefined): Mapper<any, string, unknown> => {
    return (key, value) => {
      const sKey = String(key)

      if (deep && (isObject(value) || Array.isArray(value))) {
        const path = parentPath === undefined ? sKey : `${parentPath}.${sKey}`
        if (!stopPathsSet.has(path)) {
          value = Array.isArray(value)
            ? value.map((it) => mapObj(it, mapper(path)))
            : mapObj(value, mapper(path))
        }
      }

      return [matches(exclude as string[], sKey) ? sKey : snakeCase(sKey), value]
    }
  }

  return Array.isArray(input)
    ? input.map((it) => mapObj(it, mapper(undefined)))
    : mapObj(input, mapper(undefined))
}
