import { FleetEnergyType, FleetOwnershipType, FleetStatus } from '../models/fleet-status.type';

export interface VehicleEntity {
  id: string;
  plate: string;
  code: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  assignedStudents: number;
  driverName: string;
  routeName: string;
  status: FleetStatus;
  energyType: FleetEnergyType;
  ownershipType: FleetOwnershipType;
  nextMaintenanceDate: string;
  lastInspectionDate: string;
  mileageKm: number;
  availabilityScore: number;
  documentsValid: boolean;
}
