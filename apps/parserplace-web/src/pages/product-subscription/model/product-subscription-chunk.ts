import {NetworkProductSubscriptionChunk} from '../network/model/network-product-subscription-chunk.js'
import {networkToProduct, Product} from './product.js'
import {ParameterKeyValue} from './product-url-with-parameters.js'

export class ProductSubscriptionChunk {
  id?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  subscriptionId?: number
  productId?: number
  providedUrl?: string
  parameters?: ParameterKeyValue[]
  product?: Product
}

export function networkToProductSubscriptionChunk(
  obj: NetworkProductSubscriptionChunk,
): ProductSubscriptionChunk {
  const res = new ProductSubscriptionChunk()
  res.id = obj.id
  res.createdAt = obj.createdAt
  res.createdBy = obj.createdBy
  res.subscriptionId = obj.subscriptionId
  res.productId = obj.productId
  res.providedUrl = obj.providedUrl
  res.product = networkToProduct(obj.product)
  return res
}
