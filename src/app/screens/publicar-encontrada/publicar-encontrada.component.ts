import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService } from 'src/services/mascota.service';  // Asegúrate de que MascotaService esté importado
import { AuthService } from 'src/services/auth.service';  // Importar AuthService para manejar JWT

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
  token: string | null = null; // Aquí guardamos el token JWT

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
    private router: Router,
    private mascotaService: MascotaService,  // Asegúrate de que MascotaService esté inyectado
    private authService: AuthService  // Inyectar AuthService
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

    // Aquí obtenemos el token JWT desde el localStorage
    this.token = localStorage.getItem('token');  // O cualquier otro método de almacenamiento del token
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

    if (event.target.files && event.target.files.length) {
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

    // Si el token existe, enviamos los datos
    if (this.token) {
      const mascotaEncontrada = {
        ...this.mascotaForm.value,
        estado: 'encontrada',
        // Aquí iría la lógica para subir las imágenes al servidor si es necesario
        imagenUrl: this.fotoSeleccionada || 'assets/images/default-pet.jpg'  // Foto por defecto si no se ha seleccionado una
      };

      this.mascotaService.publicarMascotaEncontrada(mascotaEncontrada, this.token).subscribe(
        data => {
          this.loading = false;
          alert('¡Mascota encontrada publicada con éxito!');
          this.router.navigate(['/feed']);
        },
        error => {
          this.loading = false;
          console.error('Error al publicar la mascota encontrada', error);
        }
      );
    } else {
      console.error('No se encontró un token JWT válido.');
      this.loading = false;
    }
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
      this.router.navigate(['/feed']);
    }
  }
}

