import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { BillingRecordModel } from '../../domain/models/billing-record.model';
import { CurrentSubscriptionModel } from '../../domain/models/current-subscription.model';
import { PaymentMethodModel } from '../../domain/models/payment-method.model';
import { SubscriptionDashboardModel } from '../../domain/models/subscription-dashboard.model';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

const fallbackDashboard: SubscriptionDashboardModel = {
  currentSubscription: {
    id: 'sub-pro-2026',
    planName: 'Plan Pro',
    status: 'active',
    price: 799,
    currency: 'USD',
    interval: 'month',
    renewsOn: '2025-06-15',
    vehicleLimit: 10,
    studentLimit: 300,
    userLimit: null,
    vehiclesUsed: 8,
    studentsUsed: 248,
    usersUsed: 5
  },
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      label: 'basic',
      price: 299,
      currency: 'USD',
      interval: 'month',
      target: 'individualOperators',
      featured: false,
      actionType: 'upgrade',
      features: [
        { text: 'oneVehicle', included: true },
        { text: 'thirtyStudents', included: true },
        { text: 'basicRoutes', included: true },
        { text: 'manualAttendance', included: true },
        { text: 'realTimeTracking', included: false },
        { text: 'advancedReports', included: false },
        { text: 'prioritySupport', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      label: 'pro',
      price: 799,
      currency: 'USD',
      interval: 'month',
      target: 'mediumFleets',
      featured: true,
      actionType: 'current',
      features: [
        { text: 'tenVehicles', included: true },
        { text: 'threeHundredStudents', included: true },
        { text: 'advancedRoutes', included: true },
        { text: 'realTimeTracking', included: true },
        { text: 'automaticAttendance', included: true },
        { text: 'completeReports', included: true },
        { text: 'prioritySupport', included: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      label: 'enterprise',
      price: null,
      currency: 'USD',
      interval: 'month',
      target: 'specificNeeds',
      featured: false,
      actionType: 'contact',
      features: [
        { text: 'unlimitedVehicles', included: true },
        { text: 'unlimitedStudents', included: true },
        { text: 'customApi', included: true },
        { text: 'sla', included: true },
        { text: 'schoolIntegration', included: true },
        { text: 'support247', included: true },
        { text: 'accountManager', included: true }
      ]
    }
  ],
  paymentMethods: [
    { id: 'pm-visa', brand: 'visa', last4: '4521', holder: 'Ana Torres', expiresOn: '08/2027', primary: true },
    { id: 'pm-mastercard', brand: 'mastercard', last4: '8834', holder: 'Empresa ABC', expiresOn: '03/2026', primary: false }
  ],
  billingHistory: [
    { id: 'inv-001', date: '2025-05-15', description: 'Plan Pro — May 2025', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-002', date: '2025-04-15', description: 'Plan Pro — April 2025', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-003', date: '2025-03-15', description: 'Plan Pro — March 2025', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
    { id: 'inv-004', date: '2025-02-15', description: 'Basic → Pro upgrade', amount: 500, currency: 'USD', method: 'MC ••8834', status: 'paid', invoiceUrl: '#' }
  ]
};

@Injectable({ providedIn: 'root' })
export class SubscriptionsApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<SubscriptionDashboardModel> {
    return forkJoin({
      currentSubscription: this.http.get<CurrentSubscriptionModel>('/api/currentSubscription'),
      plans: this.http.get<SubscriptionPlanEntity[]>('/api/subscriptionPlans'),
      paymentMethods: this.http.get<PaymentMethodModel[]>('/api/paymentMethods'),
      billingHistory: this.http.get<BillingRecordModel[]>('/api/billingHistory')
    }).pipe(catchError(() => of(fallbackDashboard)));
  }
}
