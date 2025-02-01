import {ClassType} from './util/class-type.js'
import {defaultMetadataStorage} from './metadata-storage.js'
import {EntityMetadata} from './entity-metadata.js'

/* eslint-disable-next-line space-before-function-paren */
export function Entity<T extends ClassType<T>, E>(params: EntityMetadata<E>) {
  return (object: T) => {
    defaultMetadataStorage.entityMetadata.set(object, params)
  }
}

export function getEntityMetadata<T, E>(target: ClassType<T>): EntityMetadata<E> | undefined {
  return defaultMetadataStorage.entityMetadata.get(target)
}

export function getEntityMetadataOrThrow<T>(target: ClassType<T>): EntityMetadata<any> {
  const metaData = getEntityMetadata(target)

  if (!metaData) {
    throw new Error('no metadata found')
  }

  return metaData
}

export function findEntityMetadataByTable<E>(
  entity: E,
): [ClassType<unknown> | undefined, EntityMetadata<E> | undefined] {
  for (const [func, metadata] of Array.from(defaultMetadataStorage.entityMetadata.entries())) {
    if (metadata.entity === entity) {
      return [func, metadata]
    }
  }

  return [undefined, undefined]
}
