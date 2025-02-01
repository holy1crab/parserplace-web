import {ClassType} from './util/class-type.js'
import {FieldMetadata} from './field-metadata.js'
import {defaultMetadataStorage} from './metadata-storage.js'

export function Field(params?: FieldMetadata) {
  return (object: object | ((...args: unknown[]) => unknown), propertyName: string) => {
    const target = object instanceof Function ? object : object.constructor

    if (!defaultMetadataStorage.fieldMetadata.has(target)) {
      defaultMetadataStorage.fieldMetadata.set(target, new Map())
    }

    defaultMetadataStorage.fieldMetadata.get(target)!.set(propertyName, params || {})
  }
}

export function getFieldMetadata<T extends object>(
  objectOrClass: ClassType<T> | T,
  propertyKey: string,
): FieldMetadata | undefined {
  const cls = objectOrClass instanceof Function ? objectOrClass : objectOrClass.constructor
  let classMetadata = defaultMetadataStorage.fieldMetadata.get(cls)
  let fieldMetadata = classMetadata ? classMetadata.get(propertyKey) : undefined

  if (!fieldMetadata) {
    // todo: what if there is more than one inheritance
    const parentClass = Object.getPrototypeOf(cls)
    classMetadata = defaultMetadataStorage.getClassMetadata(parentClass)
    fieldMetadata = classMetadata ? classMetadata.get(propertyKey) : undefined
  }

  return fieldMetadata
}
