export interface TrackingAlertModel {
  id: string;
  type: 'delay' | 'deviation' | 'signal' | 'arrival';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  vehicleId: string;
  time: string;
}
