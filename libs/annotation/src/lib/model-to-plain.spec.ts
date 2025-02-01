import {classToPlain} from './class-to-plain.js'

describe('modelToPlain', () => {
  it('should work', () => {
    expect(classToPlain).toEqual('annotation')
  })
})
