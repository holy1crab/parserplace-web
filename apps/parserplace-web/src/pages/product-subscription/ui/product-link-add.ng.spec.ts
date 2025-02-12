import {FactoryProvider, Signal, signal} from '@angular/core'
import {FormControl} from '@angular/forms'
import {byTestId, createComponentFactory} from '@ngneat/spectator/vitest'
import {MockProvider} from 'ng-mocks'
import {ProductSubscriptionEditStore, UrlValid} from '../product-subscription-edit.store.js'
import {PreviewAndParameters, SubscriptionItemParameter} from '../model/preview-and-parameters.js'
import {Product} from '../model/product.js'
import {
  ParameterKeyToValue,
  ProductUrlWithParameters,
} from '../model/product-url-with-parameters.js'
import {ProductLinkAdd} from './product-link-add.ng.js'

describe('ProductLinkAdd', () => {
  const TEST_INPUT_URL = 'https://sample.url'

  function createEmptyOption(key: string) {
    return {
      key,
      title: '',
      multiple: true,
      options: [],
    }
  }

  function createPreviewSignal(
    parameters: SubscriptionItemParameter[],
  ): Signal<PreviewAndParameters | undefined> {
    return signal<PreviewAndParameters>({
      url: TEST_INPUT_URL,
      product: new Product(),
      parameters,
    })
  }

  function createMockStore(override?: Partial<ProductSubscriptionEditStore>): FactoryProvider {
    return MockProvider(ProductSubscriptionEditStore, {
      linkControl: new FormControl('', {nonNullable: true}),
      linkValidity: signal<UrlValid | undefined>(undefined),
      loading: signal(false),
      previewAndParameters: signal<PreviewAndParameters | undefined>(undefined),
      error: signal(''),
      resetLinkControl: () => {},
      parameterToValue: signal<ParameterKeyToValue>({}),
      ...(override || {}),
    } satisfies Partial<ProductSubscriptionEditStore>)
  }

  const createComponent = createComponentFactory({component: ProductLinkAdd})

  it('should create', () => {
    expect(createComponent({providers: [createMockStore()]}).component).toBeDefined()
  })

  it('should display provided label', () => {
    const spectator = createComponent({providers: [createMockStore()]})
    const label = 'sample label'
    spectator.setInput('label', label)
    expect(spectator.query(byTestId('product-link-label'))?.textContent?.trim()).toEqual(label)
  })

  it('should not emit `save` when there are not filled parameters', () => {
    const spectator = createComponent({
      providers: [
        createMockStore({
          previewAndParameters: createPreviewSignal([createEmptyOption('key1')]),
        }),
      ],
    })
    const saveSpy = vi.spyOn(spectator.component.save, 'emit')

    spectator.click(byTestId('btn-save'))

    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should emit `save` when `parameters` are empty', () => {
    const spectator = createComponent({
      providers: [
        createMockStore({
          previewAndParameters: createPreviewSignal([]),
        }),
      ],
    })
    const spySave = vi.spyOn(spectator.component.save, 'emit')

    spectator.click(byTestId('btn-save'))

    expect(spySave).toBeCalledWith<[ProductUrlWithParameters]>({
      url: TEST_INPUT_URL,
      parameters: [],
    })
  })

  it('should emit `save` when `parameters` are filled', () => {
    const parameterKey = 'key1'
    const parameterValue = 0
    const spectator = createComponent({
      providers: [
        createMockStore({
          previewAndParameters: createPreviewSignal([createEmptyOption(parameterKey)]),
          parameterToValue: signal<ParameterKeyToValue>({[parameterKey]: parameterValue}),
        }),
      ],
    })
    const spySave = vi.spyOn(spectator.component.save, 'emit')

    spectator.click(byTestId('btn-save'))

    expect(spySave).toBeCalledWith({
      url: TEST_INPUT_URL,
      parameters: [{key: parameterKey, value: parameterValue}],
    } as ProductUrlWithParameters)
  })
})
