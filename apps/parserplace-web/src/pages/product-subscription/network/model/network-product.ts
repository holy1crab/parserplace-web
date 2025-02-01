import {Site} from '@pp/web/entities/site/site.js'

export interface NetworkProduct {
  id?: number
  title?: string
  coverImage?: string
  price?: number
  inStock?: boolean
  siteId?: number
  site?: Site
}
