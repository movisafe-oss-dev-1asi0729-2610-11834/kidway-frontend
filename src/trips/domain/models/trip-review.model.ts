export interface TripReviewModel {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  tripCode: string;
  dueDate: string;
}
