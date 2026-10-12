import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'
import { ResponsiveService } from '../../core/services/responsive.service';

@Component({
  imports: [FormsModule],
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
    // si ya tiene sesion activa lo enviamos directo a su modulo
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/portal-vendedor']);
      }
    }
  }

  onSubmit() {
    this.errorMessage.set('');

    const cleanEmail = this.email.trim();
    if (!cleanEmail || !this.password) {
      this.errorMessage.set('ingresa tu correo y contraseña');
      return;
    }

    this.authService.login(cleanEmail, this.password).subscribe({
      next: () => {
        // redirigimos segun el rol del usuario autenticado
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/portal-vendedor']);
        }
      },
      error: (err) => {
        this.errorMessage.set('credenciales incorrectas o servidor no disponible');
        console.error(err);
      }
    });
  }
}