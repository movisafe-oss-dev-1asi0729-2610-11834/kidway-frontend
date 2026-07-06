import { AttendanceStatus } from '../models/attendance-status.type';

export interface AttendanceRecordEntity {
  id: string;
  code: string;
  studentName: string;
  studentCode: string;
  grade: string;
  guardianName: string;
  guardianPhone: string;
  routeName: string;
  vehiclePlate: string;
  driverName: string;
  school: string;
  pickupPoint: string;
  dropOffPoint: string;
  pickupWindow: string;
  checkInTime: string | null;
  dropOffTime: string | null;
  estimatedArrival: string;
  status: AttendanceStatus;
  tripCode: string;
  reliability: number;
  lastEvent: string;
  notes: string;
}
