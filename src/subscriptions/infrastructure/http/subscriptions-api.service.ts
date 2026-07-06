import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { BillingRecordModel } from '../../domain/models/billing-record.model';
import { CurrentSubscriptionModel } from '../../domain/models/current-subscription.model';
import { PaymentMethodModel } from '../../domain/models/payment-method.model';
import { SubscriptionDashboardModel } from '../../domain/models/subscription-dashboard.model';
import { environment } from '../../../environments/environment';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

const fallbackDashboard: SubscriptionDashboardModel = {
  currentSubscription: {
    id: 'sub-pro-2026',
    planName: 'Plan Pro',
    status: 'active',
    price: 799,
    currency: 'USD',
    interval: 'month',
    renewsOn: '2026-08-15',
    startedOn: '2026-01-15',
    contractOwner: 'MoviSafe Transport',
    billingEmail: 'operations@movisafe.pe',
    renewalMode: 'assisted',
    supportContact: 'billing@kidway.pe',
    planScope: 'Company fleet contract assigned by KidWay sales team',
    vehicleLimit: 10,
    studentLimit: 300,
    userLimit: null,
    vehiclesUsed: 8,
    studentsUsed: 248,
    usersUsed: 5
  },
  plans: [],
  paymentMethods: [
    { id: 'pm-visa', brand: 'visa', last4: '4521', holder: 'Ana Torres', expiresOn: '08/2027', primary: true },
    { id: 'pm-mastercard', brand: 'mastercard', last4: '8834', holder: 'Empresa ABC', expiresOn: '03/2026', primary: false }
  ],
  billingHistory: [
    { id: 'inv-001', date: '2026-07-15', description: 'Plan Pro — July 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-002', date: '2026-06-15', description: 'Plan Pro — June 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-003', date: '2026-05-15', description: 'Plan Pro — May 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-004', date: '2026-04-15', description: 'Plan Pro — April 2026', amount: 799, currency: 'USD', method: 'MC ••8834', status: 'paid', invoiceUrl: '#' }
  ]
};

@Injectable({ providedIn: 'root' })
export class SubscriptionsApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<SubscriptionDashboardModel> {
    return forkJoin({
      currentSubscription: this.http.get<CurrentSubscriptionModel>(`${environment.apiBaseUrl}/currentSubscription`),
      plans: this.http.get<SubscriptionPlanEntity[]>(`${environment.apiBaseUrl}/subscriptionPlans`),
      paymentMethods: this.http.get<PaymentMethodModel[]>(`${environment.apiBaseUrl}/paymentMethods`),
      billingHistory: this.http.get<BillingRecordModel[]>(`${environment.apiBaseUrl}/billingHistory`)
    }).pipe(catchError(() => of(fallbackDashboard)));
  }
}
