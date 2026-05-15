import { Routes } from '@angular/router';
import { SubscriptionPaymentsPageComponent } from './views/subscription-payments-page/subscription-payments-page.component';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    component: SubscriptionPaymentsPageComponent,
    title: 'KidWay | Subscriptions & Payments'
  }
];
