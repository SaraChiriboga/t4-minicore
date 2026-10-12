import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

// respuesta que manda el backend al iniciar sesion
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name?: string;
    last_name?: string;
    vendedor_id?: number | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // ruta base del api de lucky y clave para el token
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'jwt_token';

  authErrorMessage = signal('');

  // envia las credenciales al backend
  login(email: string, password: string) {
    const body = {
      user: {
        email: email,
        password: password
      }
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/sign_ins`, body).pipe(
      // guardamos token y datos utiles del usuario logueado
      tap(response => {
        this.saveToken(response.token);
        localStorage.setItem('user_role', response.user.role);
        localStorage.setItem('user_name', `${response.user.name || ''} ${response.user.last_name || ''}`.trim() || response.user.email);
        
        if (response.user.vendedor_id) {
          localStorage.setItem('vendedor_id', response.user.vendedor_id.toString());
        } else {
          localStorage.removeItem('vendedor_id');
        }
      })
    );
  }

  // valida si el usuario es administrador
  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'Admin';
  }

  // valida si el usuario es vendedor asignado o regular
  isVendedor(): boolean {
    return localStorage.getItem('user_role') === 'Regular';
  }

  // obtiene el id del vendedor en sesion
  getVendedorId(): number | null {
    const id = localStorage.getItem('vendedor_id');
    return id ? Number(id) : null;
  }

  // obtiene el nombre visible del usuario
  getUserName(): string {
    return localStorage.getItem('user_name') || 'Usuario';
  }

  // guarda el jwt en el navegador
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // lee el jwt guardado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // revisa si hay una sesion activa
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // borra la sesion y manda al login
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_role');
    localStorage.removeItem('vendedor_id');
    localStorage.removeItem('user_name');
    this.router.navigate(['/login']);
  }
}