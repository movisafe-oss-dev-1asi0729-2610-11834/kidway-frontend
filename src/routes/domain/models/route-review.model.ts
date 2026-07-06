export interface RouteReviewModel {
  id: string;
  routeCode: string;
  routeName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}
