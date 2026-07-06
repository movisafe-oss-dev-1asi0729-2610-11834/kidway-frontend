import { Injectable, inject } from '@angular/core';
import { IncidentManagementService } from './incident-management.service';
import { IncidentRecord, IncidentStatus } from '../../domain/models/incident.model';

@Injectable({ providedIn: 'root' })
export class MockIncidentService {
  private readonly incidentManagement = inject(IncidentManagementService);

  readonly incidents = this.incidentManagement.incidents;

  getIncidents(): IncidentRecord[] {
    return this.incidentManagement.incidents();
  }

  addIncident(incident: Partial<IncidentRecord>): void {
    this.incidentManagement.createIncident(incident);
  }

  updateIncident(id: string, updates: Partial<IncidentRecord>): void {
    if (updates.status) this.incidentManagement.updateStatus(id, updates.status);
    if (updates.severity) this.incidentManagement.updateSeverity(id, updates.severity);
  }

  deleteIncident(id: string): void {
    this.incidentManagement.removeIncident(id);
  }

  changeStatus(id: string, status: IncidentStatus): void {
    this.incidentManagement.updateStatus(id, status);
  }
}
