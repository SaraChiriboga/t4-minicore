import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Regla } from '../../shared/models/regla.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReglaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/regla`;

  // lista todas las reglas de comision
  getReglas(): Observable<Regla[]> {
    return this.http.get<Regla[]>(this.apiUrl);
  }

  // crea una nueva regla escalonada
  createRegla(regla: Regla): Observable<Regla> {
    return this.http.post<Regla>(this.apiUrl, { regla });
  }

  // actualiza los montos y porcentajes de una regla
  updateRegla(id: number, regla: Regla): Observable<Regla> {
    return this.http.put<Regla>(`${this.apiUrl}/${id}`, { regla });
  }

  // elimina una regla
  deleteRegla(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

