import {Route} from '@angular/router'

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('../pages/product-subscription/product-subscription.routes.js').then(
        (m) => m.productSubscriptionRoutes,
      ),
  },
]
