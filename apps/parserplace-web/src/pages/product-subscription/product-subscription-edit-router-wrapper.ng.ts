import {Component, ChangeDetectionStrategy, inject} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {toSignal} from '@angular/core/rxjs-interop'
import {map} from 'rxjs'
import {
  ProductSubscriptionEdit,
  ProductSubscriptionAfterSavedEvent,
} from './product-subscription-edit.ng.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscription-edit-router-wrapper',
  template: `
    <app-product-subscription-edit
      [subscriptionId]="subscriptionId()"
      (afterSaved)="handleRedirect($event)"
    />
  `,
  imports: [ProductSubscriptionEdit],
})
export class ProductSubscriptionEditRouterWrapper {
  readonly activatedRoute = inject(ActivatedRoute)
  readonly router = inject(Router)

  protected subscriptionId$ = this.activatedRoute.paramMap.pipe(
    map((params) => {
      const id = params.get('id')
      return id ? Number(id) : undefined
    }),
  )
  protected subscriptionId = toSignal(this.subscriptionId$)

  handleRedirect({subscription, isNew, triggerReload}: ProductSubscriptionAfterSavedEvent) {
    if (isNew) {
      this.router.navigate([`/edit/${subscription.id}`]).then()
    } else {
      triggerReload()
    }
  }
}
