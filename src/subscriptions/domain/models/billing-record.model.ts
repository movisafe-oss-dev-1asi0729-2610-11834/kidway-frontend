export interface BillingRecordModel {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  method: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}
