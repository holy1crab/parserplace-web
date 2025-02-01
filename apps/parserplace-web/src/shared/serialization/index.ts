import camelcaseKeys from 'camelcase-keys'
import {isBoolean, isNullOrUndefined, isNumber, isObject} from '@pp/web/util/util'
import {Field, FieldMetadata, NameMetadata} from '@pp/annotation'

export function apiToBoolean(value: any): boolean | undefined {
  if (isBoolean(value)) {
    return value
  }
  return isNullOrUndefined(value) ? undefined : +value === 1
}

export function apiToNumber(value: any): number | undefined {
  if (isNumber(value)) {
    return value
  }
  if (value === '') {
    return undefined
  }
  return value ? Number(value) : value
}

export function booleanToApi(value: boolean | null | undefined, asDigit?: boolean): any {
  return value === null || value === undefined ? null : asDigit ? (value ? 1 : 0) : !!value
}

export function numberToApi(value: any): number | null {
  if (value === '') {
    return null
  }
  return isNullOrUndefined(value) ? value : isNumber(+value) ? value : null
}

// export function apiToDate(value: Date | string | null | undefined): Date | undefined {
//   if (!value) {
//     return undefined
//   }
//
//   const date = new Date(value)
//   return isValidDate(date) ? resetTime(date) : undefined
// }

// export function dateToApi(value: Date | null | undefined): string | undefined {
//   if (!(value instanceof Date)) {
//     return value
//   }
//
//   return format(value, 'yyyy-MM-dd')
// }

// export function apiToDateTime(value: string | null | undefined): Date | undefined {
//   if (!value) {
//     return undefined
//   }
//
//   const date = new Date(value)
//   return isValidDate(date) ? date : undefined
// }

// export function dateTimeToApi(
//   value: Date | null | undefined,
//   params: {
//     utc?: boolean
//     iso?: boolean
//   } = {
//     utc: true,
//     iso: false,
//   },
// ): string | undefined {
//   if (!(value instanceof Date)) {
//     return value
//   }
//
//   if (params?.iso) {
//     return value.toISOString()
//   }
//
//   return params.utc ? formatDateTimeToUTCMysqlFormat(value) : formatDateTimeToLocal(value)
// }

export function BooleanField(params?: FieldMetadata & {asDigit?: boolean}) {
  return Field({
    serialize: (val) => booleanToApi(val, params?.asDigit),
    deserialize: (data) => apiToBoolean(data),
    ...(params || {}),
  })
}

export function NumberField(params?: NameMetadata) {
  return Field({
    name: params?.name,
    serialize: (val) => numberToApi(val),
    deserialize: (data) => apiToNumber(data),
  })
}

// export function DateField(params?: Pick<FieldMetadata, 'name'>) {
//   return Field({
//     name: params?.name,
//     serialize: (val) => dateToApi(val),
//     deserialize: (data) => apiToDate(data),
//   })
// }

// export function DateTimeField(
//   params?: Pick<FieldMetadata, 'name'> & {
//     utc?: boolean
//     iso?: boolean
//   },
// ) {
//   if (!params) {
//     params = {}
//   }
//   ;(params as FieldMetadata).serialize = (val) =>
//     dateTimeToApi(val, {
//       utc: params?.utc || true,
//       iso: params?.iso,
//     })
//   ;(params as FieldMetadata).deserialize = (data) => apiToDateTime(data)
//   return Field(params)
// }

// export function TimestampField(params?: Pick<FieldMetadata, 'name'>) {
//   if (!params) {
//     params = {}
//   }
//   ;(params as FieldMetadata).serialize = (val) =>
//     val ? formatDateTimeToUTCMysqlFormat(new Date(val)) : val
//   ;(params as FieldMetadata).deserialize = (data) => apiToDateTime(data)?.getTime()
//   return Field(params)
// }

type JsonFieldMetadata = {
  defaultValue?: () => any
  camelCase?: boolean
}

export function JsonField(params?: NameMetadata & JsonFieldMetadata) {
  const {defaultValue, camelCase} = params || {}

  return Field({
    name: params?.name,
    serialize: (val) => (!isNullOrUndefined(val) ? JSON.stringify(val) : null),
    deserialize: (data) => {
      try {
        if (data && (isObject(data) || Array.isArray(data))) {
          return camelCase ? camelcaseKeys(data as Record<string, unknown>, {deep: true}) : data
        }
        const res = JSON.parse(data) || (defaultValue ? defaultValue() : null)
        return res && camelCase && isObject(res)
          ? camelcaseKeys(res as Record<string, unknown>, {deep: true})
          : res
      } catch (e) {
        const res = defaultValue ? defaultValue() : null
        return res && camelCase && isObject(res)
          ? camelcaseKeys(res as Record<string, unknown>, {deep: true})
          : res
      }
    },
  })
}
