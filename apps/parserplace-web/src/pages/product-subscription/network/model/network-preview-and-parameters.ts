import {NumberOption} from '@/shared/model/number-option.js'

export interface NetworkBaseProduct {
  title: string
  coverImage: string
  price: number
  inStock: boolean
}

export interface NetworkSubscriptionItemParameter {
  key: string
  title: string
  multiple: boolean
  options: NumberOption[]
}

export interface NetworkPreviewAndParameters {
  url: string
  parameters: NetworkSubscriptionItemParameter[]
  product: NetworkBaseProduct
}
