import {ProductUrlWithParameters} from '../../model/product-url-with-parameters.js'
import {NetworkProductSubscription} from './network-product-subscription.js'

export interface NetworkSubscriptionEditBody {
  subscriptionId?: number
  itemsAdd?: ProductUrlWithParameters[]
  itemsRemove?: number[]
}

export interface NetworkSubscriptionEditResponse {
  subscription: NetworkProductSubscription
}
