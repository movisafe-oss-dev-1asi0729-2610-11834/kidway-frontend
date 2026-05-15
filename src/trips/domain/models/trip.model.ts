export interface Trip {
  id: number;
  driverName: string;
  vehiclePlate: string;
  status: 'scheduled' | 'on-progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
}