import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedor } from '../../shared/models/vendedor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendedor`;

  // lista todos los vendedores
  getVendedores(): Observable<Vendedor[]> {
    return this.http.get<Vendedor[]>(this.apiUrl);
  }

  // crea un nuevo vendedor
  createVendedor(vendedor: Vendedor): Observable<Vendedor> {
    return this.http.post<Vendedor>(this.apiUrl, { vendedor });
  }

  // actualiza un vendedor existente
  updateVendedor(id: number, vendedor: Vendedor): Observable<Vendedor> {
    return this.http.put<Vendedor>(`${this.apiUrl}/${id}`, { vendedor });
  }

  // elimina un vendedor del sistema
  deleteVendedor(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

