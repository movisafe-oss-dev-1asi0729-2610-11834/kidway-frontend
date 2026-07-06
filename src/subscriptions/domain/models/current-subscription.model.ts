export interface CurrentSubscriptionModel {
  id: string;
  planName: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  price: number;
  currency: string;
  interval: string;
  renewsOn: string;
  vehicleLimit: number;
  studentLimit: number;
  userLimit: number | null;
  vehiclesUsed: number;
  studentsUsed: number;
  usersUsed: number;
  startedOn?: string;
  contractOwner?: string;
  billingEmail?: string;
  renewalMode?: 'automatic' | 'manual' | 'assisted';
  supportContact?: string;
  planScope?: string;
}
