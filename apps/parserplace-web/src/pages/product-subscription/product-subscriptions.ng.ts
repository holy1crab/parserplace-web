import {Component, ChangeDetectionStrategy, inject} from '@angular/core'
import {RouterLink} from '@angular/router'
import {TuiButton} from '@taiga-ui/core'
import {ProductSubscriptionsStore} from './product-subscriptions.store.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscriptions',
  template: `
    <div>
      <button
        tuiButton
        size="s"
        appearance="outline"
        type="button"
        [routerLink]="['edit']"
      >
        Create new subscription
      </button>
    </div>
  `,
  styleUrls: ['./product-subscriptions.ng.scss'],
  imports: [TuiButton, RouterLink],
  providers: [],
})
export class ProductSubscriptions {
  protected readonly store = inject(ProductSubscriptionsStore)
}
