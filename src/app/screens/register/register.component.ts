import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Validador personalizado para comprobar que las contraseñas coincidan
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // devuelve si otro validador ya ha encontrado un error
      return;
    }

    // establece error en matchingControl si la validación falla
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // Añadimos el operador ! para indicar que será inicializado más tarde
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Inicializar el formulario con validaciones
  initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.registerForm.controls;
  }

  // Mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Mostrar/ocultar confirmación de contraseña
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Enviar formulario
  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    // TODO: Implementar lógica de registro
    console.log('Registrando usuario con:', this.registerForm.value);

    // Simulación de registro exitoso
    setTimeout(() => {
      // Navegar al login o dashboard después del registro
      this.router.navigate(['/login']);
    }, 1000);
  }
}
