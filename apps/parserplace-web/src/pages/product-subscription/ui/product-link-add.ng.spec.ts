import {signal} from '@angular/core'
import {FormControl} from '@angular/forms'
import {byTestId, createComponentFactory, Spectator} from '@ngneat/spectator/vitest'
import {ProductSubscriptionEditStore, UrlValid} from '../product-subscription-edit.store.js'
import {PreviewAndParameters} from '../model/preview-and-parameters.js'
import {ProductLinkAdd} from './product-link-add.ng.js'

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
    mocks: [ProductSubscriptionEditStore],
    // providers: [
    //   {
    //     provide: ProductSubscriptionEditStore,
    //     useValue: mockProductSubscriptionEditStore,
    //   },
    // ],
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
})
