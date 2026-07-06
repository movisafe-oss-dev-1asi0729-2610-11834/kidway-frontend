export interface AttendanceReviewModel {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  studentCode: string;
  dueDate: string;
}
