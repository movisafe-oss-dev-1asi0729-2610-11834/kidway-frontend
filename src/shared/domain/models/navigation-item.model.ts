import { KidWayRole } from '../../../identity-access/domain/models/auth-user.model';

export interface NavigationItem {
  labelKey: string;
  route: string;
  icon: string;
  featureKey: string;
  roles: KidWayRole[];
}
