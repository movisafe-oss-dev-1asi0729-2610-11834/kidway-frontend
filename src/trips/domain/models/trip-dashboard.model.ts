import { TripEntity } from '../entities/trip.entity';
import { TripActivityModel } from './trip-activity.model';
import { TripReviewModel } from './trip-review.model';
import { TripSummaryModel } from './trip-summary.model';

export interface TripDashboardModel {
  summary: TripSummaryModel;
  trips: TripEntity[];
  reviews: TripReviewModel[];
  activities: TripActivityModel[];
}
