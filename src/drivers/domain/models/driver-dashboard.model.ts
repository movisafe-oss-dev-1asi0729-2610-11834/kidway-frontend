import { DriverEntity } from '../entities/driver.entity';
import { DriverReviewModel } from './driver-review.model';
import { DriverShiftModel } from './driver-shift.model';
import { DriverSummaryModel } from './driver-summary.model';

export interface DriverDashboardModel {
  summary: DriverSummaryModel;
  drivers: DriverEntity[];
  reviews: DriverReviewModel[];
  shifts: DriverShiftModel[];
}
