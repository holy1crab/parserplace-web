import {ClassType} from './util/class-type.js'
import {Field} from './field-decorator.js'
import {plainToClass} from './plain-to-class.js'
import {classToPlain} from './class-to-plain.js'

export function ClassField<T>(
  resolver: () => ClassType<T>,
  params?: {name?: string; notNull?: boolean; defaultValue?: () => T | T[] | undefined},
) {
  return Field({
    deserialize: (data) => {
      if (Array.isArray(data)) {
        return data.map((it) => plainToClass(resolver(), it))
      } else {
        return data
          ? plainToClass(resolver(), data)
          : params?.defaultValue
            ? params.defaultValue()
            : undefined
      }
    },
    serialize: (obj) => {
      if (Array.isArray(obj)) {
        return obj.map((it) => classToPlain(it))
      } else {
        return obj ? classToPlain(obj) : undefined
      }
    },
    name: params?.name,
    notNull: params?.notNull,
  })
}
