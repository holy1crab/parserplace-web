import {Route} from '@angular/router'
import {ProductSubscriptions} from './product-subscriptions.ng.js'
import {ProductSubscriptionEditRouterWrapper} from './product-subscription-edit-router-wrapper.ng.js'

export const productSubscriptionRoutes: Route[] = [
  {
    path: '',
    component: ProductSubscriptions,
  },
  {
    path: 'edit',
    component: ProductSubscriptionEditRouterWrapper,
  },
  {
    path: 'edit/:id',
    component: ProductSubscriptionEditRouterWrapper,
  },
]
