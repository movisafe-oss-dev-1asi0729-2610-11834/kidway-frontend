import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncidentDashboardData } from '../../domain/models/incident.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IncidentHttpService {
  private readonly http = inject(HttpClient);

  getDashboard() {
    return this.http.get<IncidentDashboardData>(`${environment.apiBaseUrl}/incidentManagement`);
  }
}
