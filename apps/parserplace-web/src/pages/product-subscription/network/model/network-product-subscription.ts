import {NetworkProductSubscriptionChunk} from './network-product-subscription-chunk.js'

export interface NetworkProductSubscription {
  id?: number
  createdAt?: string
  createdBy?: number
  updatedAt?: string
  updatedBy?: number

  chunks?: NetworkProductSubscriptionChunk[]
}
