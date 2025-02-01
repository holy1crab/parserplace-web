export function matches(patterns: (RegExp | string)[], value: string): boolean {
  return patterns.some((pattern) => {
    return typeof pattern === 'string' ? pattern === value : pattern.test(value)
  })
}

export function handleArrayChange<T>(arr: T[], value: T): T[] {
  if (arr.includes(value)) {
    return arr.filter((it) => it !== value)
  }
  return [...arr, value]
}

export function isNullOrUndefined(val: any): val is null | undefined {
  return val === null || val === undefined
}

export function isObject(value: any): value is object {
  return value && typeof value === 'object' && value.constructor === Object
}

export function isSetType<T>(value: any): value is Set<T> {
  return value instanceof Set
}

export function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

export function isNumber(s: any): s is number {
  return typeof s === 'number' || s instanceof Number
}

export function isBoolean(s: any): s is boolean {
  return typeof s === 'boolean' || s instanceof Boolean
}

export function removeNullOrUndefined(obj: {[key: string]: any}): {[key: string]: any} {
  for (const key of Object.keys(obj)) {
    if (isNullOrUndefined(obj[key])) {
      delete obj[key]
    }
  }

  return obj
}
