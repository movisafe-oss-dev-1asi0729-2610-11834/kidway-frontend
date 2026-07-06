import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserProfileDashboardModel } from '../../domain/models/user-profile.model';
import { AuthService } from '../../../identity-access/application/services/auth.service';

const fallbackProfileDashboard: UserProfileDashboardModel = {
  profile: {
    id: 'usr-company-admin-001',
    firstName: 'Maria',
    lastName: 'Lopez',
    displayName: 'Dr. Maria Lopez',
    username: 'maria.lopez',
    email: 'maria.lopez@movisafe.pe',
    phone: '+51 951 111 222',
    country: 'Peru',
    city: 'Lima',
    timezone: 'America/Lima',
    preferredLanguage: 'es',
    role: 'Company Admin',
    company: 'MoviSafe Transport',
    avatarInitials: 'ML',
    accountStatus: 'active',
    joinedAt: '2026-01-15',
    lastUpdatedAt: '2026-07-05',
    bio: 'Responsible for school transport operations, company users, fleet readiness and daily service quality.',
    profileCompletion: 88
  },
  preferences: {
    theme: 'system',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    routeAlerts: true,
    incidentAlerts: true,
    marketingUpdates: false
  },
  security: {
    passwordLastChangedAt: '2026-06-18',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    recoveryEmail: 'operations@movisafe.pe',
    activeSessions: [
      { id: 'session-001', device: 'Windows · Chrome', location: 'Lima, Peru', lastAccessAt: 'Today, 8:41 AM', trusted: true },
      { id: 'session-002', device: 'Android · KidWay App', location: 'Lima, Peru', lastAccessAt: 'Yesterday, 6:20 PM', trusted: true }
    ]
  },
  access: [
    {
      id: 'company-admin',
      title: 'Company administration',
      description: 'Can manage company profile, operational users, contracts and service configuration.',
      icon: 'business_center',
      status: 'enabled'
    },
    {
      id: 'operations',
      title: 'Operational modules',
      description: 'Can access fleet, drivers, routes, students, trips, attendance, incidents and analytics.',
      icon: 'dashboard_customize',
      status: 'enabled'
    },
    {
      id: 'guardian-view',
      title: 'Guardian visibility',
      description: 'Parent accounts only see assigned student tracking, alerts and profile settings.',
      icon: 'supervisor_account',
      status: 'limited'
    }
  ],
  billingAccess: {
    canManageBilling: true,
    route: '/app/subscriptions',
    planName: 'Plan Pro',
    helper: 'Billing is available only for company admins, independent operators and platform admins.'
  },
  activities: [
    {
      id: 'profile-act-001',
      time: 'Today, 8:41 AM',
      title: 'Profile opened',
      description: 'The account settings view was accessed from the topbar profile menu.',
      status: 'active'
    },
    {
      id: 'profile-act-002',
      time: 'Yesterday, 6:20 PM',
      title: 'Security check completed',
      description: 'Two-factor verification and recovery email were confirmed.',
      status: 'completed'
    },
    {
      id: 'profile-act-003',
      time: 'Jul 04, 2026',
      title: 'Notification preferences updated',
      description: 'Route alerts and incident alerts remained enabled for this company admin.',
      status: 'completed'
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class UserProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getDashboard(): Observable<UserProfileDashboardModel> {
    return this.http
      .get<UserProfileDashboardModel>('/api/userProfileDashboard')
      .pipe(
        catchError(() => of(fallbackProfileDashboard)),
        map((dashboard) => this.applyAuthenticatedUser(dashboard))
      );
  }

  private applyAuthenticatedUser(dashboard: UserProfileDashboardModel): UserProfileDashboardModel {
    const user = this.auth.currentUser();
    if (!user) {
      return dashboard;
    }

    const canManageBilling = this.auth.canAccessBilling();

    return {
      ...dashboard,
      profile: {
        ...dashboard.profile,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        company: user.company,
        avatarInitials: user.avatarInitials,
        accountStatus: user.accountStatus,
        bio: this.bioForRole(user.role)
      },
      billingAccess: {
        ...dashboard.billingAccess,
        canManageBilling,
        planName: canManageBilling ? dashboard.billingAccess.planName : 'Restricted',
        helper: canManageBilling
          ? dashboard.billingAccess.helper
          : 'Billing and plan data is hidden for this role.'
      }
    };
  }

  private bioForRole(role: string): string {
    const bios: Record<string, string> = {
      'Parent / Guardian': 'Guardian account focused on assigned student tracking, notifications and account preferences.',
      'Company Driver': 'Driver account focused on daily trip execution, route tracking and attendance support.',
      'Independent Operator': 'Independent operator account for route execution, assigned fleet data and billing access.',
      'Company Admin': 'Responsible for school transport operations, company users, fleet readiness and daily service quality.',
      'KidWay Administrator': 'Platform administrator account for company supervision, service health and global configuration.'
    };

    return bios[role] ?? 'KidWay account configured for role-based access.';
  }
}
