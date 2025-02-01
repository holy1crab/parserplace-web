import {ClassType} from './util/class-type.js'
import {defaultMetadataStorage} from './metadata-storage.js'

export function IgnoreSerialization() {
  return (object: object | ((...args: unknown[]) => unknown), propertyName: string) => {
    const target = object instanceof Function ? object : object.constructor

    if (!defaultMetadataStorage.ignoreSerializationMetadata.has(target)) {
      defaultMetadataStorage.ignoreSerializationMetadata.set(target, new Map())
    }

    defaultMetadataStorage.ignoreSerializationMetadata.get(target)!.set(propertyName, true)
  }
}

export function getIgnoreSerializationMetadata<T extends object>(
  objectOrClass: ClassType<T> | T,
  propertyKey: string,
): boolean {
  const cls = objectOrClass instanceof Function ? objectOrClass : objectOrClass.constructor
  const classMetadata = defaultMetadataStorage.ignoreSerializationMetadata.get(cls)
  return classMetadata ? !!classMetadata.get(propertyKey) : false
}
