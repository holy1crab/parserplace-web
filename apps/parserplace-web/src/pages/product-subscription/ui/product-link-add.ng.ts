import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  effect,
  output,
  input,
} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {TuiButton, TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core'
import {TuiProgressBar} from '@taiga-ui/kit'
import {isNullOrUndefined} from '@pp/web/util/util.js'
import {ProductUrlWithParameters} from '../model/product-url-with-parameters.js'
import {ProductSubscriptionEditStore} from '../product-subscription-edit.store.js'
import {ProductSubscriptionParameter} from './product-subscription-parameter.ng.js'
import {ProductSubscriptionPreview} from './product-subscription-preview.ng.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-link-add',
  template: `
    <tui-textfield class="mb-2">
      <label
        tuiLabel
        data-testid="product-link-label"
      >
        {{label() || 'Enter a link'}}
      </label>
      <input
        tuiTextfield
        [formControl]="linkControl"
      />
    </tui-textfield>

    @let linkV = linkValidity();
    @if (!error() && linkControl.value && linkV && !linkV.valid) {
      <div class="alert-error">
        {{linkV.error}}
      </div>
    }

    @if (error()) {
      <div class="alert-error">
        {{'Something went wrong'}}
      </div>
    }

    @if (loading()) {
      <progress
        size="s"
        max="100"
        tuiProgressBar
      ></progress>
    }

    @if (preview()) {
      <div class="flex-col">
        @let params = parameters();

        <app-product-subscription-preview
          [product]="preview()!.product"
        ></app-product-subscription-preview>

        @if (params.length) {
          <div class="bg-gray-100 p-4">
            @for (param of params; track param.key) {
              <app-product-subscription-parameter [parameter]="param" />
            }
          </div>
        }
      </div>

      <div class="flex justify-center mt-4">
        <button
          tuiButton
          size="m"
          appearance="outline"
          [disabled]="!allParametersValid()"
          (click)="emitSave()"
          data-testid="btn-save"
        >
          {{'Save'}}
        </button>
      </div>
    }
  `,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTextfieldComponent,
    TuiLabel,
    ReactiveFormsModule,
    TuiProgressBar,
    TuiButton,
    ProductSubscriptionParameter,
    ProductSubscriptionPreview,
    TuiTextfieldDirective,
  ],
})
export class ProductLinkAdd {
  readonly save = output<ProductUrlWithParameters>()
  readonly label = input<string | undefined>()

  protected store = inject(ProductSubscriptionEditStore)

  readonly linkControl = this.store.linkControl
  readonly loading = this.store.loading
  readonly linkValidity = this.store.linkValidity
  readonly error = this.store.error
  readonly preview = this.store.previewAndParameters

  readonly product = computed(() => this.preview()?.product)
  readonly parameters = computed(() => this.preview()?.parameters || [])

  readonly allParametersValid = computed(() => {
    return (
      !this.parameters().length ||
      this.parameters().every((it) => {
        const keyToValue = this.store.parameterToValue()
        const value = keyToValue[it.key]
        return Array.isArray(value) ? value.length > 0 : !isNullOrUndefined(value)
      })
    )
  })

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.linkControl.disable()
      } else {
        this.linkControl.enable()
      }
    })
  }

  emitSave() {
    const prev = this.preview()
    if (!prev) {
      return
    }

    const keyToValue = this.store.parameterToValue()

    this.save.emit({
      url: prev.url,
      parameters: prev.parameters.map((param) => ({
        key: param.key,
        value: keyToValue[param.key],
      })),
    })
  }
}
