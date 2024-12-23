import {inject, Injectable} from '@angular/core'
import {ProductSubscriptionRepository} from './product-subscription.repository.js'

@Injectable()
export class ProductSubscriptionsStore {
  private productSubscriptionRepository = inject(ProductSubscriptionRepository)
}
