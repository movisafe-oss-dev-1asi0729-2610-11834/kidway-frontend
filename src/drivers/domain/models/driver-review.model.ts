export type DriverReviewPriority = 'high' | 'medium' | 'low';

export interface DriverReviewModel {
  id: string;
  driverCode: string;
  driverName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: DriverReviewPriority;
}
