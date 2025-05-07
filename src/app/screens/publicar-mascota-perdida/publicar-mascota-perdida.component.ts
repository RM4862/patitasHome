import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicar-mascota-perdida',
  templateUrl: './publicar-mascota-perdida.component.html',
  styleUrls: ['./publicar-mascota-perdida.component.scss']
})
export class PublicarMascotaPerdidaComponent implements OnInit {
  formularioMascota: FormGroup;
  imagenPreview: string | null = null;
  imagenFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router
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
        // Aquí se agregaría la lógica para subir las imágenes al servidor
        // y guardar las URLs resultantes
        imagenUrl: 'assets/images/default-pet.jpg' // Imagen por defecto mientras tanto
      };

      console.log('Datos a guardar:', mascotaPerdida);

      // Aquí iría la llamada al servicio para guardar los datos
      // this.mascotasService.publicarMascotaPerdida(mascotaPerdida).subscribe(...)

      // Navegar de vuelta al feed con mensaje de éxito
      alert('¡Mascota perdida publicada con éxito!');
      this.volver();
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
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
    event.stopPropagation(); // Evitar que se active el input de archivo
    this.imagenPreview = null;
    this.imagenFile = null;
    this.fileInput.nativeElement.value = '';
  }

  volver(): void {
    this.router.navigate(['/feed']);
  }
}
