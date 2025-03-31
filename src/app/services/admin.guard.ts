import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getDecodedToken(); // lo hacemos ahora
  if (user?.role_id !== 1) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
