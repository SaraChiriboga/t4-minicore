import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'
import { ResponsiveService } from '../../core/services/responsive.service';

@Component({
  imports: [FormsModule], // permite usar [(ngModel)] en el formulario
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})

export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public responsiveService = inject(ResponsiveService);

  email = '';
  password = '';
  errorMessage = signal('');

  ngOnInit() {

    // si ya tiene sesion activa lo redirigimos segun su rol
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else if (this.authService.isVendedor()) {
        this.router.navigate(['/portal-vendedor']);
      }
    }
  }

  onSubmit() {
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // redirigimos segun el rol del usuario autenticado
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else if (this.authService.isVendedor()) {
          this.router.navigate(['/portal-vendedor']);
        } else {
          this.errorMessage.set('acceso denegado: este usuario no tiene un perfil o vendedor asignado');
        }
      },
      error: (err) => {
        this.errorMessage.set('Credenciales incorrectas o servidor no disponible');
        console.error(err);
      }
    });
  }
}