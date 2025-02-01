import {Component, ChangeDetectionStrategy, input, computed, signal} from '@angular/core'
import {NgOptimizedImage} from '@angular/common'
import {RouterLink} from '@angular/router'
import {
  TuiButton,
  TuiDataListComponent,
  TuiDropdownDirective,
  TuiDropdownOpen,
  TuiOption,
} from '@taiga-ui/core'
import {ProductSubscription} from '../model/product-subscription.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-subscription-list-view',
  template: `
    <div class="flex">
      @let product = firstProduct();
      <div class="mr-4">
        <div class="size-16 relative">
          @if (product?.coverImage; as coverImage) {
            <img
              [ngSrc]="coverImage"
              fill
              alt="preview"
            />
          }
        </div>
      </div>
      <div>
        {{ product?.title }}
      </div>
      <div>
        <button
          class=""
          appearance="flat"
          iconStart="@tui.ellipsis-vertical"
          tuiIconButton
          type="button"
          size="s"
          [tuiDropdown]="menuTemplate"
          [tuiAppearanceState]="open() ? 'hover' : null"
          [(tuiDropdownOpen)]="open"
        >
          Open
        </button>
      </div>
      <ng-template #menuTemplate>
        <tui-data-list>
          <button
            tuiOption
            iconStart="@tui.pen"
            type="button"
            [routerLink]="['edit', subscription().id]"
          >
            {{ 'Edit' }}
          </button>
        </tui-data-list>
      </ng-template>
    </div>
  `,
  imports: [
    NgOptimizedImage,
    TuiButton,
    TuiDropdownDirective,
    TuiDataListComponent,
    TuiOption,
    TuiDropdownOpen,
    RouterLink,
  ],
})
export class SubscriptionListView {
  readonly subscription = input.required<ProductSubscription>()
  protected readonly open = signal(false)
  protected readonly firstProduct = computed(() => this.subscription().chunks?.[0]?.product)
}
