import { RouteStatus } from '../models/route-status.type';

export interface SchoolRouteEntity {
  id: string;
  code: string;
  name: string;
  district: string;
  school: string;
  scheduleLabel: string;
  startTime: string;
  endTime: string;
  assignedDriver: string;
  assignedVehicle: string;
  assignedStudents: number;
  vehicleCapacity: number;
  stops: number;
  coveragePercentage: number;
  optimizationScore: number;
  estimatedDuration: string;
  status: RouteStatus;
  nextServiceAt: string;
  lastOptimizedAt: string;
  needsOptimization: boolean;
  checkpoints: string[];
}
