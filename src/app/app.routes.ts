import { Routes } from '@angular/router';
import { AppShellComponent } from '../shared/presentation/layout/app-shell/app-shell.component';
import { HomePageComponent } from '../shared/presentation/pages/home/home-page.component';
import { authGuard } from '../identity-access/application/guards/auth.guard';
import { roleGuard } from '../identity-access/application/guards/role.guard';
import { KidWayRole } from '../identity-access/domain/models/auth-user.model';

const operationalRoles: KidWayRole[] = ['Independent Operator', 'Company Admin', 'KidWay Administrator'];
const billingRoles: KidWayRole[] = ['Independent Operator', 'Company Admin', 'KidWay Administrator'];
const guardianRoles: KidWayRole[] = ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'];
const driverRoles: KidWayRole[] = ['Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'];
const adminRoles: KidWayRole[] = ['Company Admin', 'KidWay Administrator'];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth',
    loadChildren: () => import('../identity-access/presentation/routes').then((m) => m.IDENTITY_ACCESS_ROUTES)
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomePageComponent },
      { path: 'profile', loadChildren: () => import('../user-profiles/presentation/routes').then((m) => m.USER_PROFILES_ROUTES) },
      { path: 'dashboard', canActivate: [roleGuard], data: { roles: guardianRoles }, loadChildren: () => import('../dashboard/presentation/routes').then((m) => m.DASHBOARD_ROUTES) },
      { path: 'subscriptions', canActivate: [roleGuard], data: { roles: billingRoles }, loadChildren: () => import('../subscriptions/presentation/routes').then((m) => m.SUBSCRIPTIONS_ROUTES) },
      { path: 'fleet', canActivate: [roleGuard], data: { roles: operationalRoles }, loadChildren: () => import('../fleet/presentation/routes').then((m) => m.FLEET_ROUTES) },
      { path: 'drivers', canActivate: [roleGuard], data: { roles: adminRoles }, loadChildren: () => import('../drivers/presentation/routes').then((m) => m.DRIVERS_ROUTES) },
      { path: 'routes', canActivate: [roleGuard], data: { roles: operationalRoles }, loadChildren: () => import('../routes/presentation/routes').then((m) => m.ROUTES_ROUTES) },
      { path: 'students', canActivate: [roleGuard], data: { roles: operationalRoles }, loadChildren: () => import('../students/presentation/routes').then((m) => m.STUDENTS_ROUTES) },
      { path: 'assignments', canActivate: [roleGuard], data: { roles: operationalRoles }, loadChildren: () => import('../assignments/presentation/routes').then((m) => m.ASSIGNMENTS_ROUTES) },
      { path: 'tracking', canActivate: [roleGuard], data: { roles: guardianRoles }, loadChildren: () => import('../tracking/presentation/routes').then((m) => m.TRACKING_ROUTES) },
      { path: 'trips', canActivate: [roleGuard], data: { roles: driverRoles }, loadChildren: () => import('../trips/presentation/routes').then((m) => m.TRIPS_ROUTES) },
      { path: 'attendance', canActivate: [roleGuard], data: { roles: guardianRoles }, loadChildren: () => import('../attendance/presentation/routes').then((m) => m.ATTENDANCE_ROUTES) },
      { path: 'notifications', canActivate: [roleGuard], data: { roles: guardianRoles }, loadChildren: () => import('../notifications/presentation/routes').then((m) => m.NOTIFICATIONS_ROUTES) },
      { path: 'incidents', canActivate: [roleGuard], data: { roles: operationalRoles }, loadChildren: () => import('../incidents/presentation/routes').then((m) => m.INCIDENTS_ROUTES) },
      { path: 'analytics', canActivate: [roleGuard], data: { roles: adminRoles }, loadChildren: () => import('../analytics/presentation/routes').then((m) => m.ANALYTICS_ROUTES) },
      { path: 'companies', canActivate: [roleGuard], data: { roles: adminRoles }, loadChildren: () => import('../companies/presentation/routes').then((m) => m.COMPANIES_ROUTES) }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
