import {Field} from '@pp/annotation'
import {BaseFilter} from '@pp/web/shared/model/filter.js'

export class ProductSubscriptionFilter extends BaseFilter {
  @Field({name: 'q'})
  query?: string

  @Field({
    serialize: (val) => (val ? '1' : undefined),
    deserialize: (data) => data === '1',
  })
  archived?: boolean

  cloneWith(obj: Partial<ProductSubscriptionFilter>): ProductSubscriptionFilter {
    return Object.assign(new ProductSubscriptionFilter(), this, obj)
  }
}
