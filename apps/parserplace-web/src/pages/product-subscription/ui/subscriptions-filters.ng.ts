import {Component, ChangeDetectionStrategy, inject, model, effect} from '@angular/core'
import {FormBuilder, ReactiveFormsModule} from '@angular/forms'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {debounceTime, distinctUntilChanged, map} from 'rxjs'
import {TuiButton, TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective} from '@taiga-ui/core'
import {ProductSubscriptionFilter} from '../product-subscription-filter.js'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-subscriptions-filters',
  template: `
    <div class="flex gap-2 mb-4">
      <button
        tuiButton
        appearance="flat"
        size="m"
        [class.bg-orange-300!]="!filter().archived"
        (click)="setArchived(false)"
      >
        {{'Active'}}
      </button>
      <button
        tuiButton
        appearance="flat"
        size="m"
        [class.bg-orange-300!]="filter().archived"
        (click)="setArchived(true)"
      >
        {{'Archived'}}
      </button>
    </div>
    <div>
      <tui-textfield class="mb-2">
        <label tuiLabel>{{'Search'}}</label>
        <input
          tuiTextfield
          [formControl]="form.controls.query"
        />
      </tui-textfield>
    </div>
  `,
  imports: [TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective, TuiButton, ReactiveFormsModule],
})
export class SubscriptionsFilters {
  filter = model.required<ProductSubscriptionFilter>()

  private readonly fb = inject(FormBuilder)

  protected form = this.fb.group({
    query: [''],
  })

  constructor() {
    effect(() => {
      const f = this.filter()
      this.form.setValue({query: f?.query || ''}, {emitEvent: false})
    })

    this.form.controls.query.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(700),
        distinctUntilChanged(),
        map((value) => value?.trim() || ''),
      )
      .subscribe((query) => this.filter.update((filter) => filter.cloneWith({query: query || ''})))
  }

  setArchived(archived: boolean) {
    this.filter.update((filter) => filter.cloneWith({archived}))
  }
}
