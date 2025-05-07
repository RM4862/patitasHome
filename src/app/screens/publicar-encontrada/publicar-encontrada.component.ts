import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicar-encontrada',
  templateUrl: './publicar-encontrada.component.html',
  styleUrls: ['./publicar-encontrada.component.scss']
})
export class PublicarEncontradaComponent implements OnInit {
  mascotaForm: FormGroup;
  submitted = false;
  loading = false;
  fotoSeleccionada: string | ArrayBuffer | null = null;

  // Opciones para los selectores
  tiposMascota = [
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
    { value: 'ave', label: 'Ave' },
    { value: 'otro', label: 'Otro' }
  ];

  tamaniosMascota = [
    { value: 'pequeño', label: 'Pequeño' },
    { value: 'mediano', label: 'Mediano' },
    { value: 'grande', label: 'Grande' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.mascotaForm = this.formBuilder.group({
      tipoMascota: ['', Validators.required],
      tamanio: ['', Validators.required],
      color: ['', Validators.required],
      sexo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]],
      ubicacion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      contactoNombre: ['', Validators.required],
      contactoTelefono: ['', Validators.required],
      foto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializar con la fecha actual
    const fechaActual = new Date().toISOString().split('T')[0];
    const horaActual = new Date().toTimeString().split(' ')[0].slice(0, 5);

    this.mascotaForm.patchValue({
      fecha: fechaActual,
      hora: horaActual
    });
  }

  onFileChange(event: any): void {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.onload = () => {
        this.fotoSeleccionada = reader.result;
        this.mascotaForm.patchValue({
          foto: file.name
        });
      };

      reader.readAsDataURL(file);
    }
  }

  get f() { return this.mascotaForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Detener aquí si el formulario es inválido
    if (this.mascotaForm.invalid) {
      // Hacer scroll al primer error
      const firstElementWithError = document.querySelector('.is-invalid');
      if (firstElementWithError) {
        firstElementWithError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.loading = true;

    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos del formulario:', this.mascotaForm.value);

    // Simular una espera de carga
    setTimeout(() => {
      this.loading = false;

      // Mostrar un mensaje de éxito y redirigir
      alert('¡Publicación creada con éxito!');
      this.router.navigate(['/feed']);
    }, 1500);
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
      this.router.navigate(['/feed']);
    }
  }
}
