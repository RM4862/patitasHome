import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Añadimos el operador ! para indicar que será inicializado más tarde
  submitted = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Inicializar el formulario con validaciones
  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  // Mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Enviar formulario
  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    // TODO: Implementar lógica de autenticación
    console.log('Iniciando sesión con:', this.loginForm.value);

    // Simulación de inicio de sesión exitoso
    setTimeout(() => {
      // Navegar al dashboard o página principal después del login
      this.router.navigate(['/feed']);
    }, 1000);
  }
}
