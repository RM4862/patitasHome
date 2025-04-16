import { Component, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Mascota } from '../mascota.model';

@Component({
  selector: 'app-modal-mascota',
  templateUrl: './modal-mascota.component.html',
  styleUrls: ['./modal-mascota.component.scss']
})
export class ModalMascotaComponent implements OnInit {
  @Input() mascota: Mascota | null = null;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    // Añadir class al body para prevenir scroll
    document.body.classList.add('modal-abierto');

    // Event listener para cerrar con escape
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    // Eliminar class del body al destruir el componente
    document.body.classList.remove('modal-abierto');

    // Eliminar event listener
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Cerrar si se hace clic fuera del contenido del modal
  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.el.nativeElement.querySelector('.modal-backdrop')) {
      this.cerrarModal();
    }
  }
}
