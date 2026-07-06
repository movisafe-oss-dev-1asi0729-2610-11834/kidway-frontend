export type KidWayRole =
  | 'Parent / Guardian'
  | 'Company Driver'
  | 'Independent Operator'
  | 'Company Admin'
  | 'KidWay Administrator';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  role: KidWayRole;
  company: string;
  avatarInitials: string;
  accountStatus: 'active' | 'pending' | 'suspended';
}

export interface IdentityUser extends AuthUser {
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  username: string;
  email: string;
  password: string;
}
