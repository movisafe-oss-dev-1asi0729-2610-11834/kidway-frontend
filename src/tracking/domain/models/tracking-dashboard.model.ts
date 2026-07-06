import { TrackingVehicleEntity } from '../entities/tracking-vehicle.entity';
import { TrackingActivityModel } from './tracking-activity.model';
import { TrackingAlertModel } from './tracking-alert.model';
import { TrackingSummaryModel } from './tracking-summary.model';

export interface TrackingDashboardModel {
  summary: TrackingSummaryModel;
  vehicles: TrackingVehicleEntity[];
  alerts: TrackingAlertModel[];
  activities: TrackingActivityModel[];
}
