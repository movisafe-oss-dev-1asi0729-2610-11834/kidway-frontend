export interface PaymentMethodModel {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  holder: string;
  expiresOn: string;
  primary: boolean;
}
