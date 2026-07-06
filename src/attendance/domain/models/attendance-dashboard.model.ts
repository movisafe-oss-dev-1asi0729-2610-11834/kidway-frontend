import { AttendanceRecordEntity } from '../entities/attendance-record.entity';
import { AttendanceActivityModel } from './attendance-activity.model';
import { AttendanceReviewModel } from './attendance-review.model';
import { AttendanceSummaryModel } from './attendance-summary.model';

export interface AttendanceDashboardModel {
  summary: AttendanceSummaryModel;
  records: AttendanceRecordEntity[];
  reviews: AttendanceReviewModel[];
  activities: AttendanceActivityModel[];
}
