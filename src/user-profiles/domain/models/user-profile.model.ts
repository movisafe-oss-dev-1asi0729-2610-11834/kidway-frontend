export type UserProfileRole =
  | 'Independent Operator'
  | 'Company Admin'
  | 'Company Driver'
  | 'Operations Coordinator'
  | 'KidWay Administrator'
  | 'Parent / Guardian';

export type UserProfileStatus = 'active' | 'pending' | 'suspended';

export interface UserProfileModel {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  preferredLanguage: 'en' | 'es';
  role: UserProfileRole;
  company: string;
  avatarInitials: string;
  accountStatus: UserProfileStatus;
  joinedAt: string;
  lastUpdatedAt: string;
  bio: string;
  profileCompletion: number;
}

export interface UserProfilePreferencesModel {
  theme: 'system' | 'light' | 'dark';
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  routeAlerts: boolean;
  incidentAlerts: boolean;
  marketingUpdates: boolean;
}

export interface UserProfileSecurityModel {
  passwordLastChangedAt: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  recoveryEmail: string;
  activeSessions: UserProfileSessionModel[];
}

export interface UserProfileSessionModel {
  id: string;
  device: string;
  location: string;
  lastAccessAt: string;
  trusted: boolean;
}

export interface UserProfileAccessModel {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'enabled' | 'limited' | 'restricted';
}

export interface UserProfileActivityModel {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface BillingAccessModel {
  canManageBilling: boolean;
  route: string;
  planName: string;
  helper: string;
}

export interface UserProfileDashboardModel {
  profile: UserProfileModel;
  preferences: UserProfilePreferencesModel;
  security: UserProfileSecurityModel;
  access: UserProfileAccessModel[];
  billingAccess: BillingAccessModel;
  activities: UserProfileActivityModel[];
}
