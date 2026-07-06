import { StudentEntity } from '../entities/student.entity';
import { StudentActivityModel } from './student-activity.model';
import { StudentReviewModel } from './student-review.model';
import { StudentSummaryModel } from './student-summary.model';

export interface StudentDashboardModel {
  summary: StudentSummaryModel;
  students: StudentEntity[];
  reviews: StudentReviewModel[];
  activities: StudentActivityModel[];
}
