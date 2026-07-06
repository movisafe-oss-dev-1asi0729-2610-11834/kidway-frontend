import { TripShift } from '../models/trip-shift.type';
import { TripStatus } from '../models/trip-status.type';

export interface TripEntity {
  id: string;
  code: string;
  routeName: string;
  vehiclePlate: string;
  driverName: string;
  school: string;
  district: string;
  shift: TripShift;
  status: TripStatus;
  students: number;
  capacity: number;
  startTime: string;
  estimatedEndTime: string;
  actualEndTime?: string;
  nextStop: string;
  completedStops: number;
  totalStops: number;
  progress: number;
  averageSpeed: number;
  attendanceRate: number;
  incidents: number;
  trackingStatus: 'ready' | 'enabled' | 'closed' | 'blocked';
  validationMessage: string;
  updatedAt: string;
}
