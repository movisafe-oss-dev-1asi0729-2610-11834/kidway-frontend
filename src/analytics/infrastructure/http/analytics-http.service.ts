import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyticsDashboard } from '../../domain/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsHttpService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/analyticsDashboard`;

  getDashboard(): Observable<AnalyticsDashboard> {
    return this.http.get<AnalyticsDashboard>(this.endpoint);
  }
}
