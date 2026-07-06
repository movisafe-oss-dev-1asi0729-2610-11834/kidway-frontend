import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyManagementDashboardModel } from '../../domain/models/company-management.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyManagementHttpService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/companyManagement`;

  getDashboard(): Observable<CompanyManagementDashboardModel> {
    return this.http.get<CompanyManagementDashboardModel>(this.endpoint);
  }
}
