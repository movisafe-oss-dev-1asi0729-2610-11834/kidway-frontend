import { Injectable, signal } from '@angular/core';

export interface Vehicle {
    id: string;
    plate: string;
    driverName: string;
    lat: number;
    lng: number;
    status: 'on-route' | 'stopped' | 'delayed' | 'emergency';
    route?: string;
}

export interface Alert {
    id: number;
    vehicleId: string;
    type: 'deviation' | 'delay' | 'incident' | 'emergency';
    message: string;
    timestamp: Date;
    read: boolean;
}

export interface CompanyMetrics {
    activeTrips: number;
    studentsOnBoard: number;
    alerts: number;
    attendanceRate: number;
    fleetAvailability: number;
    routeCoverage: number;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
    // Datos para Company
    private companyVehicles = signal<Vehicle[]>([
        { id: 'v1', plate: 'ABC-123', driverName: 'Carlos Pérez', lat: -12.0464, lng: -77.0428, status: 'on-route', route: 'Ruta Norte' },
        { id: 'v2', plate: 'XYZ-987', driverName: 'María Gómez', lat: -12.093, lng: -77.046, status: 'delayed', route: 'Ruta Sur' },
        { id: 'v3', plate: 'JKL-456', driverName: 'Luis Torres', lat: -12.07, lng: -77.03, status: 'stopped', route: 'Ruta Este' },
    ]);

    private companyAlerts = signal<Alert[]>([
        { id: 1, vehicleId: 'v2', type: 'delay', message: 'Vehículo XYZ-987 con retraso de 8 min', timestamp: new Date(), read: false },
        { id: 2, vehicleId: 'v1', type: 'incident', message: 'Incidente menor reportado en Ruta Norte', timestamp: new Date(), read: false },
        { id: 3, vehicleId: 'v3', type: 'deviation', message: 'Desviación leve detectada', timestamp: new Date(), read: true },
    ]);

    private companyMetrics = signal<CompanyMetrics>({
        activeTrips: 12,
        studentsOnBoard: 184,
        alerts: 4,
        attendanceRate: 96.8,
        fleetAvailability: 88,
        routeCoverage: 92
    });

    // Datos para Operator (solo un vehículo)
    private operatorVehicles = signal<Vehicle[]>([
        { id: 'op1', plate: 'OP-123', driverName: 'Juan Rojas', lat: -12.05, lng: -77.04, status: 'on-route', route: 'Mi Ruta' }
    ]);

    private operatorAlerts = signal<Alert[]>([
        { id: 101, vehicleId: 'op1', type: 'delay', message: 'Próxima parada con retraso de 3 min', timestamp: new Date(), read: false }
    ]);

    // Datos para Admin (todas las empresas)
    private adminVehicles = signal<Vehicle[]>([
        ...this.companyVehicles(),
        { id: 'other1', plate: 'EMP-001', driverName: 'Conductor Externo', lat: -12.11, lng: -77.02, status: 'on-route', route: 'Ruta Inter' }
    ]);

    private adminAlerts = signal<Alert[]>([
        ...this.companyAlerts(),
        { id: 201, vehicleId: 'other1', type: 'emergency', message: 'Emergencia médica en ruta', timestamp: new Date(), read: false }
    ]);

    getVehicles(role: 'operator' | 'company' | 'admin') {
        if (role === 'operator') return this.operatorVehicles();
        if (role === 'admin') return this.adminVehicles();
        return this.companyVehicles();
    }

    getAlerts(role: 'operator' | 'company' | 'admin') {
        if (role === 'operator') return this.operatorAlerts();
        if (role === 'admin') return this.adminAlerts();
        return this.companyAlerts();
    }

    getCompanyMetrics() {
        return this.companyMetrics();
    }
}