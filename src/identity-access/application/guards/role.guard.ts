import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KidWayRole } from '../../domain/models/auth-user.model';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data?.['roles'] as KidWayRole[] | undefined;

  if (auth.hasAnyRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/app/home']);
};
