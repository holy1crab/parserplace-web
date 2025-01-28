// took from https://github.com/colinhacks/zod/issues/486
import camelcaseKeys from 'camelcase-keys'

import {type CamelCase} from 'type-fest'
import {type z} from 'zod'

type CamelCaseOptions = {
  preserveConsecutiveUppercase?: boolean
}

type CamelCasedPropertiesDeep<
  Value,
  Options extends CamelCaseOptions = {preserveConsecutiveUppercase: true},
  // eslint-disable-next-line @typescript-eslint/ban-types
> = Value extends Function | Date | RegExp
  ? Value
  : Value extends readonly unknown[]
    ? Value extends readonly [infer First, ...infer Rest]
      ? [CamelCasedPropertiesDeep<First, Options>, ...CamelCasedPropertiesDeep<Rest, Options>]
      : Value extends readonly []
        ? []
        : CamelCasedPropertiesDeep<Value[number], Options>[]
    : Value extends Set<infer U>
      ? Set<CamelCasedPropertiesDeep<U, Options>>
      : Value extends object
        ? {
            [K in keyof Value as CamelCase<K & string, Options>]: CamelCasedPropertiesDeep<
              Value[K],
              Options
            >
          }
        : Value

export const camelizeSchema = <T extends z.ZodTypeAny>(
  zod: T,
): z.ZodEffects<z.infer<T>, CamelCasedPropertiesDeep<T['_output']>> =>
  zod.transform((val) => camelcaseKeys(val, {deep: true}) as CamelCasedPropertiesDeep<T>)
