export interface AssignmentActivityModel {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}
