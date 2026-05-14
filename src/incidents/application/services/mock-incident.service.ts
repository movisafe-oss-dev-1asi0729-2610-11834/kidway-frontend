import { Injectable, signal } from '@angular/core';
import { Incident, IncidentStatus, IncidentType } from '../../domain/models/incident.model';

@Injectable({ providedIn: 'root' })
export class MockIncidentService {
    private incidentsSignal = signal<Incident[]>([
        {
            id: '1',
            type: 'delay',
            description: 'Tráfico pesado en Av. Universitaria, retraso de 10 minutos',
            status: 'open',
            timestamp: new Date(Date.now() - 3600000),
            location: { lat: -12.0464, lng: -77.0428, address: 'Av. Universitaria 123' },
            reportedBy: 'Carlos Pérez',
            vehicleId: 'v1',
        },
        {
            id: '2',
            type: 'accident',
            description: 'Choque leve en intersección, sin heridos',
            status: 'in_progress',
            timestamp: new Date(Date.now() - 7200000),
            location: { lat: -12.093, lng: -77.046, address: 'Av. Brasil 456' },
            reportedBy: 'María Gómez',
            vehicleId: 'v2',
            resolution: 'Intercambio de datos y traslado de estudiantes a otro vehículo',
            resolvedAt: new Date(Date.now() - 1800000)
        },
        {
            id: '3',
            type: 'medical_emergency',
            description: 'Estudiante con crisis asmática, se administró inhalador',
            status: 'resolved',
            timestamp: new Date(Date.now() - 86400000),
            location: { lat: -12.07, lng: -77.03, address: 'Colegio San José' },
            reportedBy: 'Luis Torres',
            vehicleId: 'v3',
            studentId: 's123',
            resolution: 'Padre recogió al estudiante en el colegio',
            resolvedAt: new Date(Date.now() - 80000000)
        }
    ]);

    incidents = this.incidentsSignal.asReadonly();

    // Obtener incidentes por rol (operator ve los suyos, company todos)
    getIncidents(role: 'operator' | 'company', userId?: string) {
        if (role === 'operator') {
            // Simulamos que el operador actual es "Carlos Pérez" (podríamos usar un servicio de auth)
            return this.incidentsSignal().filter(inc => inc.reportedBy === 'Carlos Pérez');
        }
        return this.incidentsSignal();
    }

    addIncident(incident: Omit<Incident, 'id'>): void {
        const newId = String(Date.now());
        const newIncident: Incident = { ...incident, id: newId };
        this.incidentsSignal.update(list => [newIncident, ...list]);
        // Simular notificación a padres (US06)
        console.log(`[NOTIFICACIÓN] Incidente reportado: ${incident.type} - ${incident.description}`);
    }

    updateIncident(id: string, updates: Partial<Incident>): void {
        this.incidentsSignal.update(list =>
            list.map(inc => inc.id === id ? { ...inc, ...updates } : inc)
        );
    }

    deleteIncident(id: string): void {
        this.incidentsSignal.update(list => list.filter(inc => inc.id !== id));
    }

    // Método para cambiar estado (útil para Company)
    changeStatus(id: string, status: IncidentStatus): void {
        this.updateIncident(id, { status });
    }

    // Simular obtención de ubicación actual (para nuevos incidentes)
    getCurrentLocation(): { lat: number; lng: number; address: string } {
        // Coordenadas fijas para simulación (Lima)
        return { lat: -12.0464, lng: -77.0428, address: 'Ubicación actual' };
    }
}