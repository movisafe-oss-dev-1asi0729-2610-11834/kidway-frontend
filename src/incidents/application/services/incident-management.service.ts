import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  INCIDENT_FALLBACK,
  IncidentActivity,
  IncidentDashboardData,
  IncidentRecord,
  IncidentReview,
  IncidentSeverity,
  IncidentStatus,
  IncidentSummary,
  IncidentType
} from '../../domain/models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentManagementService {
  private readonly http = inject(HttpClient);
  private readonly incidentsSignal = signal<IncidentRecord[]>(INCIDENT_FALLBACK.incidents);
  private readonly reviewsSignal = signal<IncidentReview[]>(INCIDENT_FALLBACK.reviews);
  private readonly activitiesSignal = signal<IncidentActivity[]>(INCIDENT_FALLBACK.activities);

  readonly incidents = this.incidentsSignal.asReadonly();
  readonly reviews = this.reviewsSignal.asReadonly();
  readonly activities = this.activitiesSignal.asReadonly();

  readonly summary = computed<IncidentSummary>(() => {
    const incidents = this.incidentsSignal();
    const openStatuses: IncidentStatus[] = ['reported', 'in_review', 'escalated'];
    const open = incidents.filter((incident) => openStatuses.includes(incident.status)).length;
    const critical = incidents.filter((incident) => incident.severity === 'critical').length;
    const escalated = incidents.filter((incident) => incident.status === 'escalated').length;
    const resolved = incidents.filter((incident) => incident.status === 'resolved' || incident.status === 'closed').length;
    const averageResponse = incidents.length
      ? Math.round(incidents.reduce((total, incident) => total + incident.responseTimeMinutes, 0) / incidents.length)
      : 0;
    const safetyScore = incidents.length ? Math.max(68, 100 - open * 4 - critical * 5 - escalated * 3) : 100;

    return {
      total: incidents.length,
      open,
      critical,
      escalated,
      resolved,
      averageResponse,
      safetyScore
    };
  });

  load(): void {
    this.http.get<IncidentDashboardData>(`${environment.apiBaseUrl}/incidentManagement`)
      .pipe(catchError(() => of(INCIDENT_FALLBACK)))
      .subscribe((data) => {
        this.incidentsSignal.set(data.incidents ?? INCIDENT_FALLBACK.incidents);
        this.reviewsSignal.set(data.reviews ?? INCIDENT_FALLBACK.reviews);
        this.activitiesSignal.set(data.activities ?? INCIDENT_FALLBACK.activities);
      });
  }

  createIncident(input: Partial<IncidentRecord>): IncidentRecord {
    const nextNumber = this.incidentsSignal().length + 1;
    const now = new Date();
    const incident: IncidentRecord = {
      id: `inc-${Date.now()}`,
      code: `INC-${String(nextNumber).padStart(3, '0')}`,
      title: input.title?.trim() || 'New operational incident',
      description: input.description?.trim() || 'Incident registered for operational review.',
      type: input.type ?? 'other',
      severity: input.severity ?? 'medium',
      status: input.status ?? 'reported',
      routeName: input.routeName?.trim() || 'Pending route',
      vehiclePlate: input.vehiclePlate?.trim() || 'Pending vehicle',
      driverName: input.driverName?.trim() || 'Pending driver',
      schoolName: input.schoolName?.trim() || 'Pending school',
      district: input.district?.trim() || 'Pending district',
      reportedBy: input.reportedBy?.trim() || 'Company Admin',
      reportedAt: now.toISOString(),
      studentName: input.studentName,
      evidenceCount: input.evidenceCount ?? 0,
      followUpRequired: input.followUpRequired ?? true,
      resolution: input.resolution,
      responseTimeMinutes: input.responseTimeMinutes ?? 0
    };

    this.incidentsSignal.update((items) => [incident, ...items]);
    this.activitiesSignal.update((items) => [
      {
        id: `act-${Date.now()}`,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Incident report created',
        description: `${incident.code} was registered for ${incident.vehiclePlate}.`,
        status: 'active'
      },
      ...items
    ]);
    return incident;
  }

  updateStatus(id: string, status: IncidentStatus): void {
    this.incidentsSignal.update((items) =>
      items.map((incident) => {
        if (incident.id !== id) return incident;
        const resolution = status === 'resolved' || status === 'closed'
          ? incident.resolution ?? 'Operational follow-up completed.'
          : incident.resolution;
        return { ...incident, status, resolution };
      })
    );
  }

  updateSeverity(id: string, severity: IncidentSeverity): void {
    this.incidentsSignal.update((items) => items.map((incident) => incident.id === id ? { ...incident, severity } : incident));
  }

  removeIncident(id: string): void {
    this.incidentsSignal.update((items) => items.filter((incident) => incident.id !== id));
  }

  iconForType(type: IncidentType): string {
    const icons: Record<IncidentType, string> = {
      delay: 'schedule',
      route_deviation: 'alt_route',
      mechanical: 'build',
      medical: 'medical_services',
      behavior: 'supervisor_account',
      safety: 'health_and_safety',
      other: 'report_problem'
    };
    return icons[type];
  }
}
