export interface TripRecord {
    id: string;
    vehicleId: string;
    driverName: string;
    routeName: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    plannedStopCount: number;
    actualStopCount: number;
    onTimeArrivals: number;
    totalDelaysMinutes: number;
    incidentsCount: number;
    fuelConsumptionLiters?: number;
    distanceKm?: number;
}

export interface AttendanceRecord {
    studentId: string;
    studentName: string;
    routeId: string;
    date: Date;
    boarded: boolean;
    justifiedAbsence: boolean;
}

export interface IncidentSummary {
    type: string;
    count: number;
}

export interface CompanyMetrics {
    totalTrips: number;
    totalStudents: number;
    avgOnTimeRate: number;
    totalIncidents: number;
    fuelEfficiency?: number;
}

export interface GlobalMetrics {
    totalCompanies: number;
    totalDrivers: number;
    totalVehicles: number;
    totalRoutes: number;
    activeIncidents: number;
    systemHealth: 'healthy' | 'degraded' | 'down';
}