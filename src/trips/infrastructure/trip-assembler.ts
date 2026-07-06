import { TripDashboardModel } from '../domain/models/trip-dashboard.model';
import { TripsApiResponse } from './trips-api';

export class TripAssembler {
  static toDashboard(response: TripsApiResponse): TripDashboardModel {
    return {
      summary: response.summary,
      trips: response.trips,
      reviews: response.reviews,
      activities: response.activities
    };
  }
}
