import {NetworkProduct} from './network-product.js'

export interface NetworkProductSubscriptionChunk {
  id?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  subscriptionId?: number
  productId?: number
  providedUrl?: string

  product?: NetworkProduct
}
