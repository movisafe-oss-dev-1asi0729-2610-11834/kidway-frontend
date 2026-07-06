export interface StudentActivityModel {
  id: string;
  time: string;
  title: string;
  description: string;
  studentName: string;
  status: 'completed' | 'active' | 'pending';
}
