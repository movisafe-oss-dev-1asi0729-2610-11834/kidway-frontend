import { Routes } from '@angular/router';
import { UnderDevelopmentPageComponent } from '../../shared/presentation/pages/under-development/under-development-page.component';

export const USER_PROFILES_ROUTES: Routes = [
  {
    path: '',
    component: UnderDevelopmentPageComponent,
    data: { titleKey: 'nav.profiles', boundedContext: 'User Profiles', icon: 'manage_accounts' }
  }
];
