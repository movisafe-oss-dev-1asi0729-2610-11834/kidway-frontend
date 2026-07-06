import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsDashboard } from '../../domain/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsHttpService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/analyticsDashboard';

  getDashboard(): Observable<AnalyticsDashboard> {
    return this.http.get<AnalyticsDashboard>(this.endpoint);
  }
}
