import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// protege las pantallas exclusivas para vendedores
export const vendedorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // solo pasa si inicio sesion y tiene rol de vendedor
  if (authService.isLoggedIn() && authService.isVendedor()) {
    return true;
  }

  // si no tiene permiso lo mandamos al login
  return router.parseUrl('/login');
};
