import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VendedorService } from '../../core/services/vendedor.service';
import { ReglaService } from '../../core/services/regla.service';
import { ComisionesService } from '../../core/services/comisiones.service';
import { ResponsiveService } from '../../core/services/responsive.service';
import { Vendedor } from '../../shared/models/vendedor.model';
import { Regla } from '../../shared/models/regla.model';
import { Comision } from '../../shared/models/comision.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private authService = inject(AuthService);
  private vendedorService = inject(VendedorService);
  private reglaService = inject(ReglaService);
  private comisionesService = inject(ComisionesService);
  public responsiveService = inject(ResponsiveService);

  // pestaña activa en el panel
  activeTab = signal<'comisiones' | 'vendedores' | 'reglas'>('comisiones');
  userName = this.authService.getUserName();

  // estados reactivos
  loading = signal(false);
  mensaje = signal('');
  error = signal('');

  // datos para el reporte de comisiones
  fechaInicio = '';
  fechaFin = '';
  comisiones = signal<Comision[]>([]);

  // datos de vendedores
  vendedores = signal<Vendedor[]>([]);
  nuevoVendedor: Vendedor = { nombre: '', identificacion: '' };
  vendedorEditandoId: number | null = null;

  // datos de reglas
  reglas = signal<Regla[]>([]);
  nuevaRegla: Regla = { monto_minimo: 0, porcentaje_comision: 0 };
  reglaEditandoId: number | null = null;

  ngOnInit() {
    // cargamos el reporte inicial y las listas de apoyo
    this.cargarReporte();
    this.cargarVendedores();
    this.cargarReglas();
  }

  // cambia entre las pestañas del panel
  cambiarTab(tab: 'comisiones' | 'vendedores' | 'reglas') {
    this.activeTab.set(tab);
    this.limpiarMensajes();
  }

  // consulta las comisiones filtradas por fechas
  cargarReporte() {
    this.loading.set(true);
    this.comisionesService.getReporteComisiones(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.comisiones.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('no se pudo cargar el reporte de comisiones');
        this.loading.set(false);
      }
    });
  }

  // limpia el filtro de fechas del reporte
  limpiarFiltroFechas() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarReporte();
  }

  // suma el total general de ventas del reporte
  totalVentas(): number {
    return this.comisiones().reduce((acc, c) => acc + c.total_vendido, 0);
  }

  // suma el total general de comisiones a pagar
  totalComisiones(): number {
    return this.comisiones().reduce((acc, c) => acc + c.comision_calculada, 0);
  }

  // lista los vendedores registrados
  cargarVendedores() {
    this.vendedorService.getVendedores().subscribe({
      next: (data) => this.vendedores.set(data),
      error: () => this.error.set('error al cargar la lista de vendedores')
    });
  }

  // guarda o actualiza un vendedor
  guardarVendedor() {
    if (!this.nuevoVendedor.nombre || !this.nuevoVendedor.identificacion) {
      this.error.set('por favor completa el nombre y la identificacion');
      return;
    }

    if (this.vendedorEditandoId) {
      this.vendedorService.updateVendedor(this.vendedorEditandoId, this.nuevoVendedor).subscribe({
        next: () => {
          this.mensaje.set('vendedor actualizado correctamente');
          this.cancelarEdicionVendedor();
          this.cargarVendedores();
        },
        error: () => this.error.set('error al actualizar el vendedor')
      });
    } else {
      this.vendedorService.createVendedor(this.nuevoVendedor).subscribe({
        next: () => {
          this.mensaje.set('vendedor creado con exito');
          this.nuevoVendedor = { nombre: '', identificacion: '' };
          this.cargarVendedores();
        },
        error: () => this.error.set('error al crear el vendedor')
      });
    }
  }

  // pone el formulario en modo edicion
  editarVendedor(v: Vendedor) {
    this.vendedorEditandoId = v.id || null;
    this.nuevoVendedor = { nombre: v.nombre, identificacion: v.identificacion };
  }

  // cancela el modo edicion de vendedor
  cancelarEdicionVendedor() {
    this.vendedorEditandoId = null;
    this.nuevoVendedor = { nombre: '', identificacion: '' };
  }

  // elimina un vendedor
  eliminarVendedor(id: number | undefined) {
    if (!id || !confirm('¿seguro que deseas eliminar este vendedor?')) return;
    this.vendedorService.deleteVendedor(id).subscribe({
      next: () => {
        this.mensaje.set('vendedor eliminado');
        this.cargarVendedores();
      },
      error: () => this.error.set('no se pudo eliminar el vendedor')
    });
  }

  // lista las reglas de comision
  cargarReglas() {
    this.reglaService.getReglas().subscribe({
      next: (data) => this.reglas.set(data),
      error: () => this.error.set('error al cargar las reglas')
    });
  }

  // guarda o actualiza una regla
  guardarRegla() {
    if (this.reglaEditandoId) {
      this.reglaService.updateRegla(this.reglaEditandoId, this.nuevaRegla).subscribe({
        next: () => {
          this.mensaje.set('regla actualizada correctamente');
          this.cancelarEdicionRegla();
          this.cargarReglas();
        },
        error: () => this.error.set('error al actualizar la regla')
      });
    } else {
      this.reglaService.createRegla(this.nuevaRegla).subscribe({
        next: () => {
          this.mensaje.set('regla creada con exito');
          this.nuevaRegla = { monto_minimo: 0, porcentaje_comision: 0 };
          this.cargarReglas();
        },
        error: () => this.error.set('error al crear la regla')
      });
    }
  }

  // pone el formulario en modo edicion de regla
  editarRegla(r: Regla) {
    this.reglaEditandoId = r.id || null;
    this.nuevaRegla = { monto_minimo: r.monto_minimo, porcentaje_comision: r.porcentaje_comision };
  }

  // cancela la edicion de regla
  cancelarEdicionRegla() {
    this.reglaEditandoId = null;
    this.nuevaRegla = { monto_minimo: 0, porcentaje_comision: 0 };
  }

  // elimina una regla
  eliminarRegla(id: number | undefined) {
    if (!id || !confirm('¿seguro que deseas eliminar esta regla?')) return;
    this.reglaService.deleteRegla(id).subscribe({
      next: () => {
        this.mensaje.set('regla eliminada');
        this.cargarReglas();
      },
      error: () => this.error.set('no se pudo eliminar la regla')
    });
  }

  // limpia avisos visuales
  limpiarMensajes() {
    this.mensaje.set('');
    this.error.set('');
  }

  // cierra la sesion actual
  logout() {
    this.authService.logout();
  }
}

