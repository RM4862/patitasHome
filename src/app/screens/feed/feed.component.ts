import { Component, OnInit } from '@angular/core';

interface Mascota {
  id: number;
  imagenUrl: string;
  nombre: string;
  descripcion: string;
  estado: 'perdida' | 'encontrada' | 'adopcion';
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  mascotas: Mascota[] = [];
  // Referencia a la mascota seleccionada para el modal
  mascotaSeleccionada: Mascota | null = null;
  // Control de visibilidad del modal
  modalVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Cargar datos de ejemplo
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    // Esto normalmente vendría de un servicio
    this.mascotas = [
      {
        id: 1,
        imagenUrl: 'assets/images/dog1.jpg',
        nombre: 'Max',
        descripcion: 'Golden Retriever, 3 años, visto por última vez en el Parque Central',
        estado: 'perdida'
      },
      {
        id: 2,
        imagenUrl: 'assets/images/cat1.jpg',
        nombre: 'Luna',
        descripcion: 'Gata gris, encontrada cerca de la Calle Principal',
        estado: 'encontrada'
      },
      {
        id: 3,
        imagenUrl: 'assets/images/dog2.jpg',
        nombre: 'Buddy',
        descripcion: 'Labrador mixto, 2 años, busca un hogar permanente',
        estado: 'adopcion'
      },
      // Agregar más mascotas de ejemplo según sea necesario
    ];
  }

  // Método para abrir el modal con los detalles de la mascota
  verDetallesMascota(mascota: Mascota): void {
    this.mascotaSeleccionada = mascota;
    this.modalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.modalVisible = false;
    this.mascotaSeleccionada = null;
  }

  publicarMascotaPerdida(): void {
    console.log('Navegar al formulario de mascota perdida');
    // Navegar al formulario de mascota perdida
  }

  publicarMascotaEncontrada(): void {
    console.log('Navegar al formulario de mascota encontrada');
    // Navegar al formulario de mascota encontrada
  }

  publicarEnAdopcion(): void {
    console.log('Navegar al formulario de adopción');
    // Navegar al formulario de adopción
  }

  irAlPerfil(): void {
    console.log('Navegar al perfil del usuario');
    // Navegar al perfil del usuario
  }

  irANotificaciones(): void {
    console.log('Navegar a notificaciones');
    // Navegar a notificaciones
  }

  buscar(event: any): void {
    const terminoBusqueda = event.target.value;
    console.log('Buscando:', terminoBusqueda);
    // Implementar funcionalidad de búsqueda
  }
}
