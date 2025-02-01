import {Params} from '@angular/router'
import {BooleanField} from '@pp/web/shared/serialization/index.js'
import {classToPlain, ConvertParams, plainToClass} from '@pp/annotation'
import {removeNullOrUndefined} from '@pp/web/util/util.js'

export interface Filter {
  serializeParams(): Params

  deserializeParams(params: Params): void
}

export function makeArray<T>(val: T): any[] {
  if (!val) {
    return []
  }

  if (!Array.isArray(val)) {
    return [val]
  }

  return [...val]
}

export function makeIntArray(param: string | string[]): number[] {
  return makeArray(param)
    .map((el) => parseInt(el, 10))
    .filter((el) => !isNaN(el))
}

export function fillSetFromArray<T>(s: Set<T>, array: T[]): void {
  for (const val of array) {
    s.add(val)
  }
}

export abstract class BaseFilter implements Filter {
  @BooleanField({name: 'cm', asDigit: true})
  protected touched?: boolean

  // abstract clear(): void

  // protected clearNull(): void {
  //   Object.keys(this)
  //     .forEach(key => {
  //       this[key] = null;
  //     });
  // }

  deserializeParams(params: Params): void {
    plainToClass(this, params, {excludeExtraneousValues: true})
  }

  serializeParams(params?: ConvertParams): Params {
    return removeNullOrUndefined(classToPlain(this, params))
  }

  fillSetFromArray<T>(s: Set<T>, array: T[]): void {
    fillSetFromArray(s, array)
  }

  makeArray<T>(val: T): any[] {
    return makeArray(val)
  }

  makeIntArray(param: string | string[]): number[] {
    return makeIntArray(param)
  }

  isTouched(): boolean {
    return !!this.touched
  }

  setTouched() {
    this.touched = true
  }
}
