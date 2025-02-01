import {inject, Injectable} from '@angular/core'
import {map, Observable} from 'rxjs'
import {CollectionResponse} from '@pp/web/shared/model/collection-response.js'
import {PaginationFilter} from '@pp/web/shared/model/pagination-filter.js'
import {ProductSubscriptionNetwork} from './network/product-subscription.network.js'
import {NetworkProductSubscription} from './network/model/network-product-subscription.js'
import {
  networkToPreviewAndParameters,
  PreviewAndParameters,
} from './model/preview-and-parameters.js'
import {networkToProductSubscription, ProductSubscription} from './model/product-subscription.js'
import {ProductUrlWithParameters} from './model/product-url-with-parameters.js'
import {networkToProductSubscriptionChunk} from './model/product-subscription-chunk.js'
import {ProductSubscriptionFilter} from './product-subscription-filter.js'

interface SubscriptionSave {
  subscriptionId?: number
  itemsAdd?: ProductUrlWithParameters[]
  itemsRemove?: number[]
}

@Injectable({providedIn: 'root'})
export class ProductSubscriptionRepository {
  private api = inject(ProductSubscriptionNetwork)

  search(
    filter: ProductSubscriptionFilter,
    pagination: PaginationFilter,
  ): Observable<CollectionResponse<ProductSubscription>> {
    return this.api.search(filter, pagination).pipe(
      map((response) => {
        return {
          total: response.total,
          items: response.items.map((it) => networkToProductSubscription(it)),
        }
      }),
    )
  }

  getPreviewAndParameters(urls: string[]): Observable<PreviewAndParameters[]> {
    return this.api
      .getPreviewAndParameters(urls)
      .pipe(map((results) => results.map((it) => networkToPreviewAndParameters(it))))
  }

  getSubscriptionForEditing(id: number): Observable<ProductSubscription> {
    return this.api.getProductSubscriptionForEditing(id).pipe(
      map(({subscription}) => {
        return toProductSubscription(subscription)
      }),
    )
  }

  saveSubscription(data: SubscriptionSave): Observable<{
    subscription: ProductSubscription
  }> {
    return this.api.saveProductSubscription(data).pipe(
      map((response) => {
        return {subscription: toProductSubscription(response.subscription)}
      }),
    )
  }

  deleteSubscriptionChunk(subscriptionId: number, chunkId: number, undo = false): Observable<void> {
    return this.api.deleteSubscriptionChunk(subscriptionId, chunkId, undo)
  }
}

function toProductSubscription(subscription: NetworkProductSubscription): ProductSubscription {
  const res = new ProductSubscription()
  res.id = subscription.id
  res.createdAt = subscription.createdAt ? new Date(subscription.createdAt) : undefined
  res.createdBy = subscription.createdBy
  res.updatedAt = subscription.updatedAt ? new Date(subscription.updatedAt) : undefined
  res.updatedBy = subscription.updatedBy

  if (subscription.chunks?.length) {
    res.chunks = subscription.chunks.map((it) => networkToProductSubscriptionChunk(it))
  }
  return res
}
