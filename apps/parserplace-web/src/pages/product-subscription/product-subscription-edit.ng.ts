import {Component, ChangeDetectionStrategy, inject, input, output, computed} from '@angular/core'
import {rxResource} from '@angular/core/rxjs-interop'
import {of} from 'rxjs'
import {TuiProgressBar} from '@taiga-ui/kit'
import {ProductLinkAdd} from './ui/product-link-add.ng.js'
import {ProductSubscriptionChunkEdit} from './ui/product-subscription-chunk-edit.ng.js'
import {ProductUrlWithParameters} from './model/product-url-with-parameters.js'
import {ProductSubscription} from './model/product-subscription.js'
import {ProductSubscriptionRepository} from './product-subscription.repository.js'
import {ProductSubscriptionEditStore} from './product-subscription-edit.store.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscription-edit',
  template: `
    <div class="px-default">
      <div class="text-xl">Subscription Editing</div>
      <div class="text-xs italic">
        Subscription may consist of one or more links to the SAME item
        on different websites
      </div>

      @if (subscription.isLoading()) {
        <progress
          size="s"
          max="100"
          tuiProgressBar
        ></progress>
      } @else if (subscription.hasValue()) {
        @for (chunk of subscriptionChunks(); track chunk.id) {
          <product-subscription-chunk-edit [chunk]="chunk"></product-subscription-chunk-edit>
        }
      }

      <app-product-link-add
        [label]="linkAddLabel()"
        (save)="handleLinkSaving($event)"
      />
    </div>
  `,
  imports: [ProductLinkAdd, TuiProgressBar, ProductSubscriptionChunkEdit],
  providers: [ProductSubscriptionEditStore],
})
export class ProductSubscriptionEdit {
  subscriptionId = input<number>()
  afterSaved = output<{subscription: ProductSubscription; isNew: boolean}>()

  readonly store = inject(ProductSubscriptionEditStore)
  readonly productSubscriptionRepository = inject(ProductSubscriptionRepository)

  protected readonly subscription = rxResource({
    request: () => ({id: this.subscriptionId()}),
    loader: ({request}) => {
      if (!request.id) {
        return of(undefined)
      }

      return this.productSubscriptionRepository.getSubscriptionForEditing(request.id)
    },
  })

  protected readonly subscriptionChunks = computed(() => this.subscription.value()?.chunks || [])

  protected readonly linkAddLabel = computed(() =>
    this.subscriptionChunks().length ? 'Add another link' : undefined,
  )

  handleLinkSaving(obj: ProductUrlWithParameters) {
    this.productSubscriptionRepository
      .saveSubscription({
        subscriptionId: this.subscriptionId(),
        itemsAdd: [obj],
      })
      .subscribe(({subscription}) => {
        this.store.resetLinkControl()
        this.afterSaved.emit({subscription, isNew: !this.subscriptionId()})
      })
  }
}
