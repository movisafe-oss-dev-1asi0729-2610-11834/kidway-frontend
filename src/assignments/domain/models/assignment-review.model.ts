export interface AssignmentReviewModel {
  id: string;
  title: string;
  description: string;
  assignmentCode: string;
  severity: 'high' | 'medium' | 'low';
  dueDate: string;
}
