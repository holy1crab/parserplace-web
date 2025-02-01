import {FieldMetadata} from './field-metadata.js'
import {defaultMetadataStorage} from './metadata-storage.js'
import {ClassType} from './util/class-type.js'
import {ConvertParams} from './convert-params.js'

function _findInFieldMetadataByName(
  propertiesMetadata: Map<string, FieldMetadata>,
  name: string,
): string | undefined {
  for (const [propertyKey, propertyMetadata] of Array.from(propertiesMetadata.entries())) {
    if (propertyMetadata && propertyMetadata.name === name) {
      return propertyKey
    }
  }

  return undefined
}

export function plainToClass<T extends object>(
  objectOrClass: ClassType<T> | T,
  plainData: any,
  params?: ConvertParams,
): T {
  params = params || {}

  const obj = objectOrClass instanceof Function ? new objectOrClass() : objectOrClass
  const cls = objectOrClass instanceof Function ? objectOrClass : objectOrClass.constructor
  const classesMetadata = new Map<string, FieldMetadata>()

  const inheritedClasses = []
  let prototype = cls
  while (prototype !== Function.prototype) {
    inheritedClasses.push(prototype)
    prototype = Object.getPrototypeOf(prototype)
  }

  for (const clazz of inheritedClasses.reverse()) {
    const metaData = defaultMetadataStorage.fieldMetadata.get(clazz)
    if (metaData) {
      metaData.forEach((value, key) => classesMetadata.set(key, value))
    }
  }

  const keys = Object.keys(plainData)

  for (const key of keys) {
    let propertyKey = key
    let propertyMetadata = classesMetadata.get(key)

    if (!propertyMetadata) {
      const foundPropertyKey = _findInFieldMetadataByName(classesMetadata, key)

      if (foundPropertyKey) {
        propertyKey = foundPropertyKey
        propertyMetadata = classesMetadata.get(propertyKey)
      }
    }

    let propertyValue = plainData[key]

    if (propertyMetadata) {
      if (propertyMetadata.deserialize) {
        propertyValue = propertyMetadata.deserialize(propertyValue)
      }

      ;(obj as any)[propertyKey] = propertyValue
    } else if (!params.excludeExtraneousValues) {
      ;(obj as any)[propertyKey] = propertyValue
    }
  }

  return obj
}
