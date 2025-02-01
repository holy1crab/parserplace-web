import {Component, ChangeDetectionStrategy, inject, computed} from '@angular/core'
import {Router, RouterLink} from '@angular/router'
import {FormsModule} from '@angular/forms'
import {TuiButton, TuiNotification} from '@taiga-ui/core'
import {TuiPagination, TuiProgressBar} from '@taiga-ui/kit'
import {getPagesCount} from '@pp/web/shared/model/pagination.js'
import {PaginationFilter} from '@pp/web/shared/model/pagination-filter.js'
import {SubscriptionListView} from './ui/subscription-list-view.ng.js'
import {SubscriptionsFilters} from './ui/subscriptions-filters.ng.js'
import {ProductSubscriptionsStore} from './product-subscriptions.store.js'
import {ProductSubscriptionFilter} from './product-subscription-filter.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscriptions',
  template: `
    <div class="px-default mt-4">
      <div class="relative mb-4">
        <button
          tuiButton
          size="s"
          appearance="floating"
          type="button"
          iconStart="@tui.plus"
          class="btn-add font-bold!"
          [routerLink]="['edit']"
        >
          Create new subscription
        </button>
      </div>

      <app-subscriptions-filters
        [filter]="filter()"
        (filterChange)="handleFilterChanged($event)"
      />

      @if (loading()) {
        <progress size="s" max="100" tuiProgressBar></progress>
      }

      <div>Found total: {{total()}}</div>

      <div>
        @for (sub of subscriptions(); track sub.id) {
          <app-subscription-list-view
            [subscription]="sub"
            class="block bg-gray-100 my-2 p-2"
          />
        }
      </div>

      @if (totalPages() > 1) {
        <tui-pagination
          [length]="totalPages()"
          [index]="pagination().page! - 1"
          (indexChange)="triggerPage($event)"
        ></tui-pagination>
      }

      @if (error()) {
        <tui-notification
          size="m"
          class="mb-4"
          iconStart="@tui.triangle-alert"
        >
          {{error()}}
        </tui-notification>
      }
    </div>
  `,
  styleUrls: ['./product-subscriptions.ng.scss'],
  imports: [
    TuiButton,
    RouterLink,
    FormsModule,
    TuiPagination,
    TuiProgressBar,
    SubscriptionListView,
    TuiNotification,
    SubscriptionsFilters,
  ],
  providers: [ProductSubscriptionsStore],
})
export class ProductSubscriptions {
  protected readonly store = inject(ProductSubscriptionsStore)

  private readonly router = inject(Router)

  readonly loading = computed(() => this.store.loading())
  readonly error = computed(() => this.store.error())
  readonly subscriptions = computed(() => this.store.collection()?.items ?? [])
  readonly total = computed(() => this.store.collection()?.total ?? 0)
  readonly filter = this.store.filter
  readonly pagination = this.store.pagination
  readonly totalPages = computed(() => getPagesCount(this.total(), this.pagination()?.limit))

  triggerPage(index: number) {
    this.navigate(this.filter(), this.pagination().resetPage(index + 1))
  }

  handleFilterChanged(filter: ProductSubscriptionFilter) {
    this.navigate(filter, this.pagination().resetPage())
  }

  navigate(filter: ProductSubscriptionFilter, pagination: PaginationFilter) {
    filter.setTouched()
    const queryParams = {
      ...filter.serializeParams(),
      ...pagination.serializeParams(),
    }
    this.router.navigate([], {queryParams}).then()
  }
}
