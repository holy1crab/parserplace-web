import {
  networkToProductSubscriptionChunk,
  ProductSubscriptionChunk,
} from './product-subscription-chunk.js'
import {NetworkProductSubscription} from '../network/model/network-product-subscription.js'

export class ProductSubscription {
  id?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  updatedBy?: number
  title?: string
  chunks?: ProductSubscriptionChunk[]
}

export function networkToProductSubscription(obj: NetworkProductSubscription): ProductSubscription {
  const res = new ProductSubscription()
  res.id = obj.id
  res.createdAt = obj.createdAt ? new Date(obj.createdAt) : undefined
  res.title = obj.title
  res.chunks = obj.chunks?.map((it) => networkToProductSubscriptionChunk(it))
  return res
}
