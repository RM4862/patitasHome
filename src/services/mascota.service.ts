import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiUrl = 'http://localhost:8000/api/registrar_mascota/';  // URL de tu API

  constructor(private http: HttpClient) { }

  // Método para publicar una mascota encontrada
  publicarMascotaEncontrada(mascota: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, mascota, { headers });

  }

  // Método para publicar una mascota perdida
  publicarMascotaPerdida(mascota: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, mascota, { headers });

  }
}
