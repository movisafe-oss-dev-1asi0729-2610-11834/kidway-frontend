export interface SubscriptionPlanEntity {
  id: string;
  name: string;
  label: string;
  price: number | null;
  currency: string;
  interval: string;
  target: string;
  featured: boolean;
  actionType: 'upgrade' | 'current' | 'contact';
  features: SubscriptionPlanFeature[];
}

export interface SubscriptionPlanFeature {
  text: string;
  included: boolean;
}
