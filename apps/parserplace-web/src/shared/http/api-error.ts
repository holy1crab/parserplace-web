import {BaseError} from '@/shared/error.js'

export class ApiParseError extends BaseError {
  rawBody: string

  // eslint-disable-next-line max-len
  // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
  constructor(message: string, rawBody: string) {
    super(message)

    this.rawBody = rawBody

    Object.setPrototypeOf(this, ApiParseError.prototype)
  }
}

export class ApiError extends BaseError {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
