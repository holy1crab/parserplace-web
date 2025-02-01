import {Site} from '@pp/web/entities/site/site.js'
import {NetworkProduct} from '../network/model/network-product.js'

export class Product {
  title?: string
  coverImage?: string
  price?: number
  inStock?: boolean
  siteId?: number
  site?: Site
}

export function networkToProduct(obj?: NetworkProduct): Product {
  const product = new Product()
  product.title = obj?.title
  product.coverImage = obj?.coverImage
  product.price = obj?.price
  product.inStock = obj?.inStock
  product.siteId = obj?.siteId
  product.site = obj?.site
  return product
}
