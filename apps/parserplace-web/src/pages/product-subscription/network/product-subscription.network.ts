import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {ApiClient} from '@pp/web/shared/http/api-client.js'
import {CollectionResponse} from '@pp/web/shared/model/collection-response.js'
import {PaginationFilter} from '@pp/web/shared/model/pagination-filter.js'
import {ProductSubscriptionFilter} from '../product-subscription-filter.js'
import {NetworkPreviewAndParameters} from './model/network-preview-and-parameters.js'
import {NetworkProductSubscription} from './model/network-product-subscription.js'
import {
  NetworkSubscriptionEditBody,
  NetworkSubscriptionEditResponse,
} from './model/network-subscription-edit.js'

@Injectable({providedIn: 'root'})
export class ProductSubscriptionNetwork {
  private api = inject(ApiClient)

  search(
    filter: ProductSubscriptionFilter,
    pagination: PaginationFilter,
  ): Observable<CollectionResponse<NetworkProductSubscription>> {
    return this.api.get<CollectionResponse<NetworkProductSubscription>>(
      '/api/product/subscription/search',
      {
        params: {...filter.serializeParams(), ...pagination.asLimitOffset()},
        camelCaseKeysResponse: {deep: true},
      },
    )
  }

  getPreviewAndParameters(urls: string[]): Observable<NetworkPreviewAndParameters[]> {
    return this.api.post<NetworkPreviewAndParameters[]>(
      '/api/product/preview_and_parameters',
      {urls},
      {camelCaseKeysResponse: {deep: true}},
    )
  }

  getProductSubscriptionForEditing(id: number): Observable<{
    subscription: NetworkProductSubscription
  }> {
    return this.api.get<{subscription: NetworkProductSubscription}>(
      `/api/product/subscription/${id}/edit`,
      {camelCaseKeysResponse: {deep: true}},
    )
  }

  saveProductSubscription(
    body: NetworkSubscriptionEditBody,
  ): Observable<NetworkSubscriptionEditResponse> {
    return this.api.post<NetworkSubscriptionEditResponse>('/api/product/subscription', body, {
      snakeCaseKeysRequest: true,
    })
  }

  deleteSubscriptionChunk(
    subscriptionId: number,
    chunkId: number,
    undo: boolean,
  ): Observable<void> {
    return this.api.post(
      `/api/product/subscription/${subscriptionId}/chunk-delete`,
      {
        chunkId,
        undo,
      },
      {snakeCaseKeysRequest: true},
    )
  }
}
