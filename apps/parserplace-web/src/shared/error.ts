export class BaseError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, BaseError.prototype)

    this.name = this.constructor.name
    if (typeof (Error as any).captureStackTrace === 'function') {
      ;(Error as any).captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

export class NotImplementedError extends BaseError {
  constructor() {
    super('Not implemented')
  }
}
