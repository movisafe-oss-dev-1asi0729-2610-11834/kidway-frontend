import { BillingRecordModel } from './billing-record.model';
import { CurrentSubscriptionModel } from './current-subscription.model';
import { PaymentMethodModel } from './payment-method.model';
import { SubscriptionPlanEntity } from '../entities/subscription-plan.entity';

export interface SubscriptionDashboardModel {
  currentSubscription: CurrentSubscriptionModel;
  plans: SubscriptionPlanEntity[];
  paymentMethods: PaymentMethodModel[];
  billingHistory: BillingRecordModel[];
}
