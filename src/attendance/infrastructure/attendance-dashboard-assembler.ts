import { AttendanceDashboardModel } from '../domain/models/attendance-dashboard.model';
import { AttendanceDashboardApiResponse } from './attendance-dashboard-api';

export class AttendanceDashboardAssembler {
  static toDashboard(response: AttendanceDashboardApiResponse): AttendanceDashboardModel {
    return {
      summary: response.summary,
      records: response.records,
      reviews: response.reviews,
      activities: response.activities
    };
  }
}
