export interface StudentReviewModel {
  id: string;
  studentCode: string;
  studentName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}
