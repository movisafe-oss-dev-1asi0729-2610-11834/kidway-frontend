export interface RouteActivityModel {
  id: string;
  time: string;
  title: string;
  description: string;
  routeName: string;
  status: 'completed' | 'active' | 'pending';
}
