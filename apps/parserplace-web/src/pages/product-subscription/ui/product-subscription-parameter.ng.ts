import {Component, ChangeDetectionStrategy, input, computed, signal, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {
  TuiButton,
  TuiDataListComponent,
  TuiDropdownDirective,
  TuiDropdownOpen,
  TuiOption,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core'
import {TuiCheckbox, TuiChip} from '@taiga-ui/kit'
import {handleArrayChange} from '@/util/util.js'
import {ProductSubscriptionEditStore} from '../product-subscription-edit.store.js'
import {SubscriptionItemParameter} from '../model/preview-and-parameters.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-subscription-parameter',
  template: `
    <div>
      {{parameter().title}}
    </div>

    <div>
      <button
        tuiButton
        appearance="outline"
        size="s"
        [tuiDropdown]="content"
        [(tuiDropdownOpen)]="dropdownOpened"
      >
        Select
      </button>
    </div>

    <div class="mt-2">
      @for (option of selectedOptions(); track option.value) {
        <tui-chip
          appearance="neutral"
          size="s"
          class="mr-2 mb-2"
        >
          {{option.text}}
        </tui-chip>
      }
    </div>

    <ng-template #content>
      <tui-textfield
        iconStart="@tui.search"
        class="m-4"
      >
        <input
          [placeholder]="'Filter'"
          [focused]="false"
          [(ngModel)]="query"
          tuiTextfield
        />
      </tui-textfield>

      <tui-data-list class="min-w-64">
        @for (el of filteredOptions(); track el.value) {
          <label
            tuiOption
            (click)="handleChecked(el.value)"
            [value]="el.value"
          >
            {{el.text}}
            <input
              tuiCheckbox
              [checked]="checkedValues().includes(el.value)"
              type="checkbox"
            />
          </label>
        }
      </tui-data-list>
    </ng-template>
  `,
  imports: [
    TuiOption,
    TuiCheckbox,
    TuiDataListComponent,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiDropdownDirective,
    TuiDropdownOpen,
    FormsModule,
    TuiButton,
    TuiChip,
  ],
})
export class ProductSubscriptionParameter {
  readonly parameter = input.required<SubscriptionItemParameter>()

  readonly store = inject(ProductSubscriptionEditStore)

  protected readonly options = computed(() => this.parameter().options)
  protected readonly keyToOption = computed(
    () => new Map(this.options().map((opt) => [opt.value, opt])),
  )

  protected readonly query = signal('')

  protected readonly filteredOptions = computed(() => {
    if (this.query()) {
      return this.options().filter((it) =>
        it.text?.toLowerCase().includes(this.query().toLowerCase()),
      )
    }
    return this.options()
  })

  protected readonly dropdownOpened = signal(false)
  protected readonly checkedValues = signal<number[]>([])

  protected readonly selectedOptions = computed(() => {
    return this.checkedValues()
      .map((it) => this.keyToOption().get(it)!)
      .filter((it) => it)
  })

  protected handleChecked(value: number) {
    this.checkedValues.update((values) => handleArrayChange(values, value))
    this.store.parameterToValue.update((val) => ({
      ...val,
      ...{[this.parameter().key]: this.checkedValues()},
    }))
  }
}
