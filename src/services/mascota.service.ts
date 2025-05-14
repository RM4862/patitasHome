import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiUrlPerdida = 'http://localhost:8000/api/registrar_mascota/';
  private apiUrlEncontrada = 'http://localhost:8000/api/registrar_mascota_encontrada/';

  constructor(private http: HttpClient) { }

  // Método para publicar una mascota encontrada
  publicarMascotaEncontrada(mascota: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrlEncontrada, mascota, { headers });
  }

  // Método para publicar una mascota perdida
  publicarMascotaPerdida(mascota: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrlPerdida, mascota, { headers });
  }

  // Método para obtener publicaciones con filtros
  getPublicaciones(filtros: any = {}): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) {
        params = params.set(key, filtros[key]);
      }
    });
    return this.http.get<any[]>('http://localhost:8000/api/publicaciones/', { params });
  }
}
