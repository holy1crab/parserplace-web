import {computed, inject, Injectable, Signal, signal} from '@angular/core'
import {ActivatedRoute, Params} from '@angular/router'
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop'
import {map, Observable, switchMap, zip} from 'rxjs'
import {plainToClass} from '@pp/annotation'
import {CollectionResponse} from '@pp/web/shared/model/collection-response.js'
import {PaginationFilter} from '@pp/web/shared/model/pagination-filter.js'
import {ProductSubscriptionRepository} from './product-subscription.repository.js'
import {ProductSubscriptionFilter} from './product-subscription-filter.js'
import {ProductSubscription} from './model/product-subscription.js'

type ProductSubscriptionState = {
  loading: boolean
  error?: string
  collection?: CollectionResponse<ProductSubscription>
}

@Injectable()
export class ProductSubscriptionsStore {
  static DEFAULT_LIMIT = 5
  static FIRST_PAGE = 1

  private readonly repository = inject(ProductSubscriptionRepository)

  private readonly state = signal<ProductSubscriptionState>({
    loading: false,
  })

  private readonly filter$ = injectQueryParams().pipe(
    map((params) => plainToClass(ProductSubscriptionFilter, params)),
  )

  private readonly pagination$ = injectQueryParams().pipe(
    map((params) => {
      return plainToClass(
        PaginationFilter.init(
          ProductSubscriptionsStore.FIRST_PAGE,
          ProductSubscriptionsStore.DEFAULT_LIMIT,
        ),
        params,
        {excludeExtraneousValues: true},
      )
    }),
  )

  private subscriptions$ = zip([this.filter$, this.pagination$]).pipe(
    switchMap(([filter, pageFilter]) => this.repository.search(filter, pageFilter)),
  )

  loading = computed(() => this.state().loading)
  collection = computed(() => this.state().collection)
  error = computed(() => this.state().error)

  filter = toSignal(this.filter$) as Signal<ProductSubscriptionFilter>
  pagination = toSignal(this.pagination$) as Signal<PaginationFilter>

  constructor() {
    this.subscriptions$.pipe(takeUntilDestroyed()).subscribe({
      next: (collection) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          collection,
        }))
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: `Something went wrong: ${err.message}`,
        }))
      },
    })
  }
}

function injectQueryParams(): Observable<Params> {
  return inject(ActivatedRoute).queryParams
}
