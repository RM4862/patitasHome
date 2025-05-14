import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService } from '../mascota.service';  // Asegúrate de que MascotaService esté importado
import { AuthService } from '../auth.service';  // Importar AuthService para el manejo de JWT

@Component({
  selector: 'app-publicar-mascota-perdida',
  templateUrl: './publicar-mascota-perdida.component.html',
  styleUrls: ['./publicar-mascota-perdida.component.scss']
})
export class PublicarMascotaPerdidaComponent implements OnInit {
  formularioMascota: FormGroup;
  imagenPreview: string | null = null;
  imagenFile: File | null = null;
  token: string | null = null; // Aquí guardamos el token JWT

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mascotaService: MascotaService,
    private authService: AuthService  // Inyectar AuthService
  ) {
    this.formularioMascota = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      otraEspecie: [''],
      raza: [''],
      edad: [''],
      unidadEdad: ['año(s)'],
      sexo: [''],
      colorPrincipal: [''],
      caracteristicasEspeciales: [''],
      fechaPerdida: ['', Validators.required],
      lugarPerdida: ['', Validators.required],
      ultimaVez: [''],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$|^[0-9]{10}$')]],
      notasAdicionales: ['']
    });

    // Aquí podrías almacenar el token JWT en una variable si ya está en el localStorage o en el servicio
    this.token = localStorage.getItem('token');  // O el método que usas para almacenar el token
  }

  ngOnInit(): void {
    // Escuchar cambios en el campo de especie para validaciones condicionales
    this.formularioMascota.get('especie')?.valueChanges.subscribe(especie => {
      const otraEspecieControl = this.formularioMascota.get('otraEspecie');

      if (especie === 'otro') {
        otraEspecieControl?.setValidators([Validators.required]);
      } else {
        otraEspecieControl?.clearValidators();
      }

      otraEspecieControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.formularioMascota.valid) {
      console.log('Formulario válido:', this.formularioMascota.value);

      // Crear objeto con datos para enviar al servicio
      const mascotaPerdida = {
        ...this.formularioMascota.value,
        estado: 'perdida',
        imagenUrl: 'assets/images/default-pet.jpg'  // Imagen por defecto mientras tanto
      };

      console.log('Datos a guardar:', mascotaPerdida);

      // Verificar si el token JWT está presente y añadirlo a la solicitud HTTP
      if (this.token) {
        this.mascotaService.publicarMascotaPerdida(mascotaPerdida, this.token).subscribe(
          data => {
            alert('¡Mascota perdida publicada con éxito!');
            this.volver();
          },
          error => {
            console.error('Error al publicar la mascota perdida', error);
          }
        );
      } else {
        console.error('No se encontró un token JWT válido.');
      }
    } else {
      this.marcarCamposComoTocados(this.formularioMascota);
    }
  }

  marcarCamposComoTocados(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(campo => {
      const control = formGroup.get(campo);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.marcarCamposComoTocados(control);
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imagenFile = file;

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(event: Event): void {
    event.stopPropagation();  // Evitar que se active el input de archivo
    this.imagenPreview = null;
    this.imagenFile = null;
    this.fileInput.nativeElement.value = '';
  }

  volver(): void {
    this.router.navigate(['/feed']);
  }
}

