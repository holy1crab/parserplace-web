import {signal} from '@angular/core'
import {FormControl} from '@angular/forms'
import {byTestId, createComponentFactory, Spectator} from '@ngneat/spectator/jest'
import {ProductSubscriptionEditStore, UrlValid} from '../product-subscription-edit.store.js'
import {PreviewAndParameters} from '../model/preview-and-parameters.js'
import {ProductLinkAdd} from './product-link-add.ng.js'
// import {Product} from '../model/product.js'
// import {vi} from 'vitest'

const mockProductSubscriptionEditStore = {
  linkControl: new FormControl('', {nonNullable: true}),
  linkValidity: signal<UrlValid | undefined>(undefined),
  loading: signal(false),
  previewAndParameters: signal<PreviewAndParameters | undefined>(undefined),
  error: signal(''),
  resetLinkControl: () => {},
} satisfies Partial<ProductSubscriptionEditStore>

describe('ProductLinkAdd', () => {
  let spectator: Spectator<ProductLinkAdd>
  let component: ProductLinkAdd
  // let store: SpyObject<typeof mockProductSubscriptionEditStore>

  const createComponent = createComponentFactory({
    component: ProductLinkAdd,
    // mocks: [ProductSubscriptionEditStore],
    providers: [
      {
        provide: ProductSubscriptionEditStore,
        useValue: mockProductSubscriptionEditStore,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent()
    component = spectator.component
    let store = spectator.inject(ProductSubscriptionEditStore)
  })

  it('should create', () => {
    expect(component).toBeDefined()
  })

  it('should display provided label', () => {
    const SAMPLE_LABEL = 'sample label'
    spectator.setInput('label', SAMPLE_LABEL)
    spectator.detectChanges()
    const label = spectator.query(byTestId('product-link-label'))
    expect(label?.textContent?.trim()).toEqual(SAMPLE_LABEL)
  })

  // it('should display an error', () => {
  //   store.linkControl.setValue('value', {emitEvent: false})
  // })

  /*it('should not emit `save` when there are parameters', () => {
    // console.log('>>>>>>>>>> 1')
    const store = spectator.inject(ProductSubscriptionEditStore)
    store.previewAndParameters.and.returnValue(
      signal<PreviewAndParameters>({
        product: new Product(),
        url: '',
        parameters: [{title: 'sample', key: 'key', multiple: false, options: []}],
      }),
    )
    console.log('>>>>>>>>>', store.previewAndParameters())
    // vi.mock(component.save)
    // vi.spyOn(component.save, 'emit')
    // createSpyObject(store)
    // store.previewAndParameters.andReturn(
    //   signal<PreviewAndParameters>({
    //     url: '',
    //     product: new Product(),
    //     parameters: [],
    //   }),
    // )
    // const button = spectator.query(byTestId('btn-save')) as HTMLButtonElement
    // button?.click()
    // console.log(3)
    // expect(component.save.emit).toHaveBeenCalledTimes(0)
  })*/
})
