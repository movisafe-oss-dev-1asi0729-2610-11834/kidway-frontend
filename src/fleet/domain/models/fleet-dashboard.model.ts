import { VehicleEntity } from '../entities/vehicle.entity';
import { FleetSummaryModel } from './fleet-summary.model';
import { MaintenanceAlertModel } from './maintenance-alert.model';

export interface FleetDashboardModel {
  summary: FleetSummaryModel;
  vehicles: VehicleEntity[];
  maintenanceAlerts: MaintenanceAlertModel[];
}
