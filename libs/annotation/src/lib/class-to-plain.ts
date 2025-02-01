import {getIgnoreSerializationMetadata} from './ignore-decorator.js'
import {getFieldMetadata} from './field-decorator.js'
import {ConvertParams} from './convert-params.js'

export function classToPlain<T extends object>(
  obj: T,
  params?: {fields?: string[]} & ConvertParams,
): Record<string, unknown> {
  const res: Record<string, unknown> = {}
  let objectFields = Object.keys(obj)

  if (params?.fields?.length) {
    objectFields = objectFields.filter((field) => params.fields?.includes(field))
  }

  for (const field of objectFields) {
    const ignore = getIgnoreSerializationMetadata(obj, field)

    if (ignore) {
      continue
    }

    const objectValue = (obj as any)[field]
    const fieldMetadata = getFieldMetadata(obj, field)

    if (!(!fieldMetadata && params?.excludeExtraneousValues)) {
      const key = fieldMetadata?.name || field
      const value = fieldMetadata?.serialize
        ? fieldMetadata.serialize(objectValue)
        : objectValue || (fieldMetadata?.notNull ? objectValue : null)

      res[key] = value
    }
  }

  return res
}
