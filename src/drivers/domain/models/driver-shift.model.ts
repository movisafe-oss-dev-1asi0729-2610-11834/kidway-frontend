export interface DriverShiftModel {
  id: string;
  time: string;
  title: string;
  description: string;
  driverName: string;
  status: 'completed' | 'active' | 'pending';
}
