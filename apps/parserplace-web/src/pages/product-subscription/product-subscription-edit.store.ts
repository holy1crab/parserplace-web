import {computed, inject, Injectable, signal} from '@angular/core'
import {FormBuilder, Validators} from '@angular/forms'
import {toSignal} from '@angular/core/rxjs-interop'
import {
  catchError,
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  iif,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs'
import {ProductSubscriptionRepository} from './product-subscription.repository.js'
import {PreviewAndParameters} from './model/preview-and-parameters.js'
import {ParameterKeyToValue} from './model/product-url-with-parameters.js'

interface ProductPreviewState {
  loading: boolean
  error?: string
  data?: PreviewAndParameters
}

export type UrlValid = {valid: true} | {valid: false; error: string}

const productPreviewInitState: ProductPreviewState = {
  loading: false,
}

@Injectable()
export class ProductSubscriptionEditStore {
  #fb = inject(FormBuilder)

  #productSubscriptionRepository = inject(ProductSubscriptionRepository)

  public linkControl = this.#fb.control('', {
    nonNullable: true,
    validators: [Validators.maxLength(512), Validators.required],
  })

  #linkChanged$ = this.linkControl.valueChanges.pipe(
    // skip(1),
    distinctUntilChanged(),
  )

  #linkValidity$ = this.#linkChanged$.pipe(
    filter((it) => !!it),
    map((it) => this.isUrlValid(it)),
  )

  #previewState$: Observable<ProductPreviewState> = this.#linkChanged$.pipe(
    debounceTime(700),
    switchMap((url) =>
      iif(
        () => this.isUrlValid(url).valid,
        defer(() => this.fetchPreviewAndMap(url)),
        defer(() => of(productPreviewInitState)),
      ),
    ),
  )

  readonly #previewState = toSignal(this.#previewState$, {initialValue: productPreviewInitState})

  // reading
  public readonly linkValidity = toSignal(this.#linkValidity$)
  public readonly loading = computed(() => this.#previewState().loading)
  public readonly previewAndParameters = computed(() => this.#previewState().data)
  public readonly error = computed(() => this.#previewState().error)

  // set
  public readonly parameterToValue = signal<ParameterKeyToValue>({})

  resetLinkControl() {
    this.linkControl.reset()
  }

  private fetchPreviewAndMap(url: string): Observable<ProductPreviewState> {
    return this.#productSubscriptionRepository.getPreviewAndParameters([url]).pipe(
      map((previewAndParameters) => {
        return {
          loading: false,
          data: previewAndParameters.length ? previewAndParameters[0] : undefined,
        }
      }),
      catchError((err) =>
        of({
          loading: false,
          error: `Something went wrong: ${err.text}`,
        }),
      ),
      startWith({loading: true}),
    )
  }

  private isUrlValid(url: string): UrlValid {
    if (url.length < 4) {
      return {error: 'The url is too short', valid: false}
    }
    return {valid: true}
  }
}
