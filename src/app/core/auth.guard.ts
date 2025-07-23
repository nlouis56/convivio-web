import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    // Check if route requires specific role
    const requiredRole = route.data['role'] as string;
    if (requiredRole && !authService.hasRole(requiredRole)) {
      return router.parseUrl('/unauthorized');
    }
    return true;
  }

  // Store the attempted URL for redirecting after login
  return router.parseUrl('/login?returnUrl=' + state.url);
};
