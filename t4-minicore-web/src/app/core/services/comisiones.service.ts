import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../../shared/models/venta.model';
import { Comision } from '../../shared/models/comision.model';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/ventas';

  // obtiene el listado de ventas (opcionalmente filtrado por vendedor)
  getVentas(vendedorId?: number): Observable<Venta[]> {
    let params = new HttpParams();
    if (vendedorId) {
      params = params.set('vendedor_id', vendedorId.toString());
    }
    return this.http.get<Venta[]>(this.apiUrl, { params });
  }

  // registra una nueva venta en el sistema
  registrarVenta(data: { monto: number; fecha?: string; vendedor_id?: number }): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, { venta: data });
  }

  // calcula y obtiene el reporte de comisiones en base al rango de fechas
  getReporteComisiones(fechaInicio?: string, fechaFin?: string, vendedorId?: number): Observable<Comision[]> {
    let params = new HttpParams().set('reporte', 'true');
    if (fechaInicio) {
      params = params.set('fecha_inicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fecha_fin', fechaFin);
    }
    if (vendedorId) {
      params = params.set('vendedor_id', vendedorId.toString());
    }
    return this.http.get<Comision[]>(this.apiUrl, { params });
  }
}
