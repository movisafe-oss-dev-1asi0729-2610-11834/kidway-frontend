import { TrackingStatus } from '../models/tracking-status.type';

export interface TrackingVehicleEntity {
  id: string;
  vehicleId: string;
  plate: string;
  driverName: string;
  routeName: string;
  schoolName: string;
  district: string;
  status: TrackingStatus;
  latitude: number;
  longitude: number;
  speedKmh: number;
  etaMinutes: number;
  progressPercent: number;
  signalStrength: number;
  studentCount: number;
  nextStop: string;
  deviationMeters: number;
  lastUpdate: string;
}
