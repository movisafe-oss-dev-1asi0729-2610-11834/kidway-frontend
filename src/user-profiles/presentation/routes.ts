import { Routes } from '@angular/router';
import { UserProfilePageComponent } from './views/user-profile-page.component';

export const USER_PROFILES_ROUTES: Routes = [
  {
    path: '',
    component: UserProfilePageComponent,
    title: 'KidWay | User Profile'
  }
];
