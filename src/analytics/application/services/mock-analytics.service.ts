import { Injectable, signal } from '@angular/core';
import { TripRecord, AttendanceRecord, IncidentSummary, CompanyMetrics, GlobalMetrics } from '../../domain/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class MockAnalyticsService {
    // Datos simulados de viajes (últimos 30 días)
    private tripsSignal = signal<TripRecord[]>([
        {
            id: 't1', vehicleId: 'v1', driverName: 'Carlos Pérez', routeName: 'Ruta Norte',
            date: new Date(2026, 4, 10), startTime: new Date(2026, 4, 10, 7, 0), endTime: new Date(2026, 4, 10, 8, 15),
            plannedStopCount: 8, actualStopCount: 8, onTimeArrivals: 7, totalDelaysMinutes: 8, incidentsCount: 0, fuelConsumptionLiters: 5.2, distanceKm: 18
        },
        {
            id: 't2', vehicleId: 'v2', driverName: 'María Gómez', routeName: 'Ruta Sur',
            date: new Date(2026, 4, 10), startTime: new Date(2026, 4, 10, 6, 45), endTime: new Date(2026, 4, 10, 8, 5),
            plannedStopCount: 6, actualStopCount: 6, onTimeArrivals: 4, totalDelaysMinutes: 15, incidentsCount: 1, fuelConsumptionLiters: 4.5, distanceKm: 15
        },
        {
            id: 't3', vehicleId: 'v3', driverName: 'Luis Torres', routeName: 'Ruta Este',
            date: new Date(2026, 4, 10), startTime: new Date(2026, 4, 10, 7, 15), endTime: new Date(2026, 4, 10, 8, 30),
            plannedStopCount: 7, actualStopCount: 7, onTimeArrivals: 6, totalDelaysMinutes: 5, incidentsCount: 0, fuelConsumptionLiters: 4.8, distanceKm: 16
        },
        // Más días...
        {
            id: 't4', vehicleId: 'v1', driverName: 'Carlos Pérez', routeName: 'Ruta Norte',
            date: new Date(2026, 4, 9), startTime: new Date(2026, 4, 9, 7, 5), endTime: new Date(2026, 4, 9, 8, 20),
            plannedStopCount: 8, actualStopCount: 7, onTimeArrivals: 6, totalDelaysMinutes: 12, incidentsCount: 0, fuelConsumptionLiters: 5.0, distanceKm: 18
        }
    ]);

    // Datos de asistencia (últimos 30 días)
    private attendanceSignal = signal<AttendanceRecord[]>([
        { studentId: 's1', studentName: 'Ana López', routeId: 'r1', date: new Date(2026, 4, 10), boarded: true, justifiedAbsence: false },
        { studentId: 's2', studentName: 'Luis Fernández', routeId: 'r2', date: new Date(2026, 4, 10), boarded: false, justifiedAbsence: true },
        // ...
    ]);

    // Resumen de incidentes por tipo (últimos 30 días)
    private incidentSummarySignal = signal<IncidentSummary[]>([
        { type: 'delay', count: 8 },
        { type: 'accident', count: 1 },
        { type: 'detour', count: 2 },
        { type: 'medical_emergency', count: 0 },
        { type: 'other', count: 1 }
    ]);

    getTrips(dateFrom?: Date, dateTo?: Date, driver?: string): TripRecord[] {
        let filtered = [...this.tripsSignal()];
        if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
        if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);
        if (driver) filtered = filtered.filter(t => t.driverName === driver);
        return filtered;
    }

    getAttendanceByMonth(month: number, year: number, routeId?: string): AttendanceRecord[] {
        // Simulación: filtrar por mes/año
        return this.attendanceSignal().filter(a => a.date.getMonth() === month && a.date.getFullYear() === year);
    }

    getIncidentSummary(): IncidentSummary[] {
        return this.incidentSummarySignal();
    }

    getCompanyMetrics(): CompanyMetrics {
        const trips = this.tripsSignal();
        const totalTrips = trips.length;
        const totalOnTime = trips.reduce((sum, t) => sum + t.onTimeArrivals, 0);
        const totalStops = trips.reduce((sum, t) => sum + t.plannedStopCount, 0);
        const avgOnTimeRate = totalStops > 0 ? (totalOnTime / totalStops) * 100 : 0;
        const totalIncidents = trips.reduce((sum, t) => sum + t.incidentsCount, 0);
        return {
            totalTrips,
            totalStudents: 245, // simulados
            avgOnTimeRate,
            totalIncidents,
            fuelEfficiency: 5.0 // litros/100km simulado
        };
    }

    getGlobalMetrics(): GlobalMetrics {
        return {
            totalCompanies: 5,
            totalDrivers: 48,
            totalVehicles: 48,
            totalRoutes: 120,
            activeIncidents: 3,
            systemHealth: 'healthy'
        };
    }

    // Lista de conductores disponibles
    getDrivers(): string[] {
        return ['Carlos Pérez', 'María Gómez', 'Luis Torres'];
    }

    getRoutes(): string[] {
        return ['Ruta Norte', 'Ruta Sur', 'Ruta Este'];
    }
}