import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Users } from './pages/users/users';
import { Admin } from './pages/admin/admin';
import { PortalVendedor } from './pages/portal-vendedor/portal-vendedor';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { vendedorGuard } from './core/guards/vendedor.guard';

// definicion de rutas principales de la aplicacion
export const routes: Routes = [
  { path: 'login', component: Login, title: 'Iniciar Sesión - T4 Minicore' },
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard], title: 'Panel de Administración' },
  { path: 'portal-vendedor', component: PortalVendedor, canActivate: [authGuard, vendedorGuard], title: 'Portal del Vendedor' },
  { path: 'users', component: Users, canActivate: [authGuard, adminGuard], title: 'Gestión de Usuarios' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];