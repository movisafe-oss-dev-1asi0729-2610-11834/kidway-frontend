import { Routes } from '@angular/router';
import { LoginPageComponent } from './views/login/login-page.component';
import { RegisterPageComponent } from './views/register/register-page.component';
import { guestGuard } from '../application/guards/auth.guard';

export const IDENTITY_ACCESS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent, canActivate: [guestGuard], title: 'KidWay | Login' },
  { path: 'register', component: RegisterPageComponent, canActivate: [guestGuard], title: 'KidWay | Register' }
];
