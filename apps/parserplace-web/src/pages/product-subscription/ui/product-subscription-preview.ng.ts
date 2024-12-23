import {Component, ChangeDetectionStrategy, input} from '@angular/core'
import {NgOptimizedImage} from '@angular/common'
import {Product} from '../model/product.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscription-preview',
  template: `
    <div class="flex p-4">
      <div class="relative size-16 mr-4">
        @if (product().coverImage; as coverImage) {
          <img [ngSrc]="coverImage" fill>
        } @else {
          <!-- todo: no image placeholder -->
        }
      </div>
      <div>
        <div class="italic">
          {{product().site?.title}}
        </div>
        @if (!product().inStock) {
          <div class="text-red-500">{{'out of stock'}}</div>
        }
        <div class="font-bold">{{product().price}} ₽</div>
        <div>
          {{product().title}}
        </div>
      </div>
    </div>
  `,
  imports: [NgOptimizedImage],
})
export class ProductSubscriptionPreview {
  product = input.required<Product>()
}
