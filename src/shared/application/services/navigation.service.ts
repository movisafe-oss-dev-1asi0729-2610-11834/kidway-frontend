import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '../../../identity-access/application/services/auth.service';
import { NavigationItem } from '../../domain/models/navigation-item.model';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly auth = inject(AuthService);

  readonly items: NavigationItem[] = [
    { labelKey: 'nav.dashboard', route: '/app/dashboard', icon: 'dashboard', featureKey: 'dashboard', roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.fleet', route: '/app/fleet', icon: 'directions_bus', featureKey: 'fleet', roles: ['Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.drivers', route: '/app/drivers', icon: 'badge', featureKey: 'drivers', roles: ['Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.routes', route: '/app/routes', icon: 'alt_route', featureKey: 'routes', roles: ['Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.students', route: '/app/students', icon: 'school', featureKey: 'students', roles: ['Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.assignments', route: '/app/assignments', icon: 'rule', featureKey: 'assignments', roles: ['Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.tracking', route: '/app/tracking', icon: 'location_on', featureKey: 'tracking', roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.trips', route: '/app/trips', icon: 'route', featureKey: 'trips', roles: ['Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.attendance', route: '/app/attendance', icon: 'fact_check', featureKey: 'attendance', roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.notifications', route: '/app/notifications', icon: 'campaign', featureKey: 'notifications', roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.incidents', route: '/app/incidents', icon: 'report_problem', featureKey: 'incidents', roles: ['Independent Operator', 'Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.analytics', route: '/app/analytics', icon: 'bar_chart', featureKey: 'analytics', roles: ['Company Admin', 'KidWay Administrator'] },
    { labelKey: 'nav.companies', route: '/app/companies', icon: 'business', featureKey: 'companies', roles: ['Company Admin', 'KidWay Administrator'] }
  ];

  readonly visibleItems = computed(() => this.items.filter((item) => this.auth.hasAnyRole(item.roles)));
}
