import {NumberOption} from '@pp/web/shared/model/number-option.js'
import {
  NetworkPreviewAndParameters,
  NetworkSubscriptionItemParameter,
} from '../network/model/network-preview-and-parameters.js'
import {networkToProduct, Product} from './product.js'

export interface SubscriptionItemParameter {
  key: string
  title: string
  multiple: boolean
  options: NumberOption[]
}

export interface PreviewAndParameters {
  url: string
  parameters: SubscriptionItemParameter[]
  product: Product
}

export function networkToItemParameter(
  obj: NetworkSubscriptionItemParameter,
): SubscriptionItemParameter {
  return {
    key: obj.key,
    title: obj.title,
    multiple: obj.multiple,
    options: obj.options.map((it) => ({...it})),
  }
}

export function networkToPreviewAndParameters(
  obj: NetworkPreviewAndParameters,
): PreviewAndParameters {
  return {
    url: obj.url,
    product: networkToProduct(obj.product),
    parameters: obj.parameters.map((it) => networkToItemParameter(it)),
  }
}
