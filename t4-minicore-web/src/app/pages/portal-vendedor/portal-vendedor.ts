import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ComisionesService } from '../../core/services/comisiones.service';
import { ResponsiveService } from '../../core/services/responsive.service';
import { Venta } from '../../shared/models/venta.model';
import { Comision } from '../../shared/models/comision.model';

@Component({
  selector: 'app-portal-vendedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-vendedor.html',
  styleUrl: './portal-vendedor.css'
})
export class PortalVendedor implements OnInit {
  private authService = inject(AuthService);
  private comisionesService = inject(ComisionesService);
  public responsiveService = inject(ResponsiveService);

  // datos del usuario logueado
  userName = this.authService.getUserName();
  vendedorId = this.authService.getVendedorId();

  // estados reactivos
  loading = signal(false);
  mensaje = signal('');
  error = signal('');

  // formulario para registrar nueva venta
  nuevaVenta = {
    monto: 0,
    fecha: new Date().toISOString().split('T')[0]
  };

  // filtro de fechas para ver comisiones
  fechaInicio = '';
  fechaFin = '';

  // listas de datos
  misVentas = signal<Venta[]>([]);
  miComision = signal<Comision | null>(null);

  ngOnInit() {
    // cargamos las ventas y el calculo de comision al entrar
    this.cargarDatos();
  }

  // carga tanto el listado de ventas como el calculo de comisiones
  cargarDatos() {
    this.cargarVentas();
    this.cargarComision();
  }

  // consulta las ventas registradas por este vendedor
  cargarVentas() {
    this.loading.set(true);
    this.comisionesService.getVentas().subscribe({
      next: (ventas) => {
        this.misVentas.set(ventas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('no se pudieron cargar tus ventas');
        this.loading.set(false);
      }
    });
  }

  // consulta el acumulado y la comision calculada segun las reglas
  cargarComision() {
    this.comisionesService.getReporteComisiones(this.fechaInicio, this.fechaFin).subscribe({
      next: (reporte) => {
        // el backend nos devuelve el reporte filtrado para nuestro vendedor
        if (reporte && reporte.length > 0) {
          this.miComision.set(reporte[0]);
        } else {
          this.miComision.set(null);
        }
      },
      error: () => {
        this.error.set('no se pudo calcular tu comision');
      }
    });
  }

  // envia la venta nueva a la base de datos
  registrarVenta() {
    this.limpiarMensajes();

    if (!this.nuevaVenta.monto || this.nuevaVenta.monto <= 0) {
      this.error.set('ingresa un monto valido mayor a cero');
      return;
    }

    this.loading.set(true);
    this.comisionesService.registrarVenta({
      monto: Number(this.nuevaVenta.monto),
      fecha: this.nuevaVenta.fecha
    }).subscribe({
      next: () => {
        this.mensaje.set('venta registrada con exito');
        this.nuevaVenta.monto = 0;
        this.cargarDatos();
      },
      error: () => {
        this.error.set('error al registrar la venta');
        this.loading.set(false);
      }
    });
  }

  // limpia el filtro de fechas
  limpiarFiltro() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarComision();
  }

  // limpia los mensajes de aviso
  limpiarMensajes() {
    this.mensaje.set('');
    this.error.set('');
  }

  // cierra la sesion del vendedor
  logout() {
    this.authService.logout();
  }
}

