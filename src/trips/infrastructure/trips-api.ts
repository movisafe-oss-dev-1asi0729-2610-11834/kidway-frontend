import { TripActivityModel } from '../domain/models/trip-activity.model';
import { TripReviewModel } from '../domain/models/trip-review.model';
import { TripSummaryModel } from '../domain/models/trip-summary.model';
import { TripEntity } from '../domain/entities/trip.entity';

export interface TripsApiResponse {
  summary: TripSummaryModel;
  trips: TripEntity[];
  reviews: TripReviewModel[];
  activities: TripActivityModel[];
}
