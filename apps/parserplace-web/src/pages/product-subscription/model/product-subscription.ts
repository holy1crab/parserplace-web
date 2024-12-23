import {ProductSubscriptionChunk} from '@/pages/product-subscription/model/product-subscription-chunk.js'

export class ProductSubscription {
  id?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  updatedBy?: number
  chunks?: ProductSubscriptionChunk[]
}
