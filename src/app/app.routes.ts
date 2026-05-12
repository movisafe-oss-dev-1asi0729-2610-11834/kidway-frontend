import { Routes } from '@angular/router';
import { AppShellComponent } from '../shared/presentation/layout/app-shell/app-shell.component';
import { HomePageComponent } from '../shared/presentation/pages/home/home-page.component';
import { ProfilePageComponent } from '../shared/presentation/pages/profile/profile-page.component';
import { AuthPlaceholderComponent } from '../shared/presentation/pages/auth/auth-placeholder.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/home' },
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: AuthPlaceholderComponent, data: { titleKey: 'auth.login' } },
      { path: 'register', component: AuthPlaceholderComponent, data: { titleKey: 'auth.register' } }
    ]
  },
  {
    path: 'app',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomePageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'dashboard', loadChildren: () => import('../dashboard/presentation/routes').then((m) => m.DASHBOARD_ROUTES) },
      { path: 'subscriptions', loadChildren: () => import('../subscriptions/presentation/routes').then((m) => m.SUBSCRIPTIONS_ROUTES) },
      { path: 'fleet', loadChildren: () => import('../fleet/presentation/routes').then((m) => m.FLEET_ROUTES) },
      { path: 'drivers', loadChildren: () => import('../drivers/presentation/routes').then((m) => m.DRIVERS_ROUTES) },
      { path: 'routes', loadChildren: () => import('../routes/presentation/routes').then((m) => m.ROUTES_ROUTES) },
      { path: 'students', loadChildren: () => import('../students/presentation/routes').then((m) => m.STUDENTS_ROUTES) },
      { path: 'assignments', loadChildren: () => import('../assignments/presentation/routes').then((m) => m.ASSIGNMENTS_ROUTES) },
      { path: 'tracking', loadChildren: () => import('../tracking/presentation/routes').then((m) => m.TRACKING_ROUTES) },
      { path: 'trips', loadChildren: () => import('../trips/presentation/routes').then((m) => m.TRIPS_ROUTES) },
      { path: 'attendance', loadChildren: () => import('../attendance/presentation/routes').then((m) => m.ATTENDANCE_ROUTES) },
      { path: 'notifications', loadChildren: () => import('../notifications/presentation/routes').then((m) => m.NOTIFICATIONS_ROUTES) },
      { path: 'incidents', loadChildren: () => import('../incidents/presentation/routes').then((m) => m.INCIDENTS_ROUTES) },
      { path: 'analytics', loadChildren: () => import('../analytics/presentation/routes').then((m) => m.ANALYTICS_ROUTES) },
      { path: 'companies', loadChildren: () => import('../companies/presentation/routes').then((m) => m.COMPANIES_ROUTES) }
    ]
  },
  { path: '**', redirectTo: 'app/home' }
];
