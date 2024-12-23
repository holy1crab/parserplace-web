export function isObject(value: any): value is object {
  return value && typeof value === 'object' && value.constructor === Object
}

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
