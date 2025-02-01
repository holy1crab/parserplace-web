import {ClassType} from './util/class-type.js'
import {getGlobal} from './util/get-global.js'
import {EntityMetadata} from './entity-metadata.js'
import {FieldMetadata} from './field-metadata.js'

export class MetadataStorage {
  entityMetadata = new Map<ClassType<unknown>, EntityMetadata<any>>()

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
  fieldMetadata = new Map<Function, Map<string, FieldMetadata>>()

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
  ignoreSerializationMetadata = new Map<Function, Map<string, boolean>>()

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
  getClassMetadata(f: Function): Map<string, FieldMetadata> | undefined {
    return this.fieldMetadata.get(f)
  }
}

const globalScope = getGlobal()

if (!globalScope.annotationMetadataStorage) {
  globalScope.annotationMetadataStorage = new MetadataStorage()
}
export const defaultMetadataStorage = globalScope.annotationMetadataStorage as MetadataStorage
