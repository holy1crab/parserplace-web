import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
  inject,
  DestroyRef,
} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {TuiButton, TuiHint} from '@taiga-ui/core'
import {ProductSubscriptionRepository} from '../product-subscription.repository.js'
import {ProductSubscriptionChunk} from '../model/product-subscription-chunk.js'
import {ProductSubscriptionPreview} from './product-subscription-preview.ng.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'product-subscription-chunk-edit',
  template: `
    <div class="flex items-center">
      <app-product-subscription-preview
        [product]="product()!"
        [class.opacity-50]="deleted()"
      />
      <button
        tuiButton
        [tuiHint]="deleted() ? 'Restore' : 'Delete'"
        [tuiHintShowDelay]="100"
        [iconStart]="deleted() ? '@tui.rotate-ccw' : '@tui.trash-2'"
        appearance="icon"
        (click)="deleteChunk(deleted())"
      ></button>
    </div>
  `,
  imports: [ProductSubscriptionPreview, TuiButton, TuiHint],
})
export class ProductSubscriptionChunkEdit {
  readonly chunk = input.required<ProductSubscriptionChunk>()

  protected readonly product = computed(() => this.chunk().product)

  readonly deleted = signal(false)

  private readonly subscriptionRepository = inject(ProductSubscriptionRepository)

  private readonly destroyRef = inject(DestroyRef)

  deleteChunk(undo: boolean) {
    const chunk = this.chunk()
    this.subscriptionRepository
      .deleteSubscriptionChunk(chunk.subscriptionId!, chunk.id!, undo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.deleted.update((val) => !val)
      })
  }
}
