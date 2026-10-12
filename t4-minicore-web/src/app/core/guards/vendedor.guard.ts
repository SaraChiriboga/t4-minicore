import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// protege las pantallas exclusivas para vendedores
export const vendedorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // si esta logueado y no es admin, es vendedor autorizado
  if (authService.isLoggedIn() && !authService.isAdmin()) {
    return true;
  }

  // si no tiene permiso lo mandamos al login
  return router.parseUrl('/login');
};
