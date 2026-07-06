import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileDashboardModel } from '../../domain/models/user-profile.model';
import { UserProfileApiService } from '../../infrastructure/http/user-profile-api.service';

@Injectable({ providedIn: 'root' })
export class UserProfileFacadeService {
  private readonly api = inject(UserProfileApiService);

  loadDashboard(): Observable<UserProfileDashboardModel> {
    return this.api.getDashboard();
  }
}
