import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MascotaService } from 'src/services/mascota.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  publicaciones: any[] = [];
  mascotaSeleccionada: any = null;
  modalVisible: boolean = false;

  constructor(private router: Router, private mascotaService: MascotaService) { }

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.mascotaService.getPublicaciones().subscribe(
      data => {
        console.log('Publicaciones recibidas:', data); // <-- Aquí agregas el log
        this.publicaciones = data;
      },
      error => {
        console.error('Error al cargar publicaciones', error);
      }
    );
  }

  verDetallesMascota(publicacion: any): void {
    this.mascotaSeleccionada = publicacion;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.mascotaSeleccionada = null;
  }

  publicarMascotaPerdida(): void {
    this.router.navigate(['/publicarperdida']);
  }

  publicarMascotaEncontrada(): void {
    this.router.navigate(['/publicarencontrada']);
  }

  publicarEnAdopcion(): void {
    this.router.navigate(['/publicaradopcion']);
  }

  irAlPerfil(): void {
    // Navegar al perfil del usuario
  }

  irANotificaciones(): void {
    // Navegar a notificaciones
  }

  buscar(event: any): void {
    // Implementar funcionalidad de búsqueda
  }
}
