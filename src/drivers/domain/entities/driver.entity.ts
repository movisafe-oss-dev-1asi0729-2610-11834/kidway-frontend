import { DriverStatus } from '../models/driver-status.type';

export interface DriverEntity {
  id: string;
  code: string;
  fullName: string;
  photoInitials: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiresAt: string;
  phone: string;
  email: string;
  assignedVehicle: string;
  assignedRoute: string;
  status: DriverStatus;
  availabilityLabel: string;
  tripsToday: number;
  studentsAssigned: number;
  safetyScore: number;
  punctualityScore: number;
  lastCheckIn: string;
  documentsValid: boolean;
  yearsOfExperience: number;
}
