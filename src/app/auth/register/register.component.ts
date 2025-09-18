import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'; // https://sweetalert2.github.io/

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	registerForm: FormGroup;
	formSubmitted = false;

	constructor(
		private fb: FormBuilder,
		private usuarioService: UsuarioService,
		private router: Router
	) {
		this.registerForm = this.fb.group({
			nombre: ['', [Validators.required, Validators.minLength(3)]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(5)]],
			password2: ['', [Validators.required]],
			terms: [false, [Validators.requiredTrue]]
		}, {
			validators: this.passwordsIguales('password', 'password2')
		});
	}

	ngOnInit(): void { }

	/**
	 * Envía el formulario de registro. Si el formulario es inválido, no hace nada.
	 * Si es válido, aquí se podría agregar la lógica para crear el usuario.
	 * @returns void
	 */
	crearUsuario() {
		this.formSubmitted = true;
		if (this.registerForm.invalid) {
			return;
		}
		this.usuarioService.crearUsuario(this.registerForm.value).subscribe({
			next: () => {
				Swal.fire({
					title: 'Usuario creado',
					icon: 'success'
				})
				this.router.navigateByUrl('/');
			},
			error: (error) => {
				Swal.fire({
					title: 'Error!',
					text: error.error.msg,
					icon: 'error'
				})
			}
		});
	}

	/**
	 * Verifica si un campo del formulario no es válido y ya se intentó enviar el formulario.
	 * @param campo Nombre del campo a validar
	 * @returns true si el campo es inválido y se intentó enviar el formulario
	 */
	campoNoValido(campo: string): boolean {
		if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Verifica si el usuario no ha aceptado los términos y ya se intentó enviar el formulario.
	 * @returns true si no se aceptaron los términos y se intentó enviar el formulario
	 */
	aceptaTerminos(): boolean {
		return !this.registerForm.get('terms')?.value && this.formSubmitted;
	}

	/**
	 * Verifica si las contraseñas no coinciden y ya se intentó enviar el formulario.
	 * @returns true si las contraseñas no son iguales y se intentó enviar el formulario
	 */
	contrasenasNoValidas() {
		const pass1 = this.registerForm.get('password')?.value;
		const pass2 = this.registerForm.get('password2')?.value;
		return (pass1 !== pass2 && this.formSubmitted);
	}

	/**
	 * Validador personalizado para comprobar que dos campos de contraseña sean iguales.
	 * @param pass1Name Nombre del primer campo de contraseña
	 * @param pass2Name Nombre del segundo campo de contraseña
	 * @returns Una función validadora para usar en el FormGroup
	 */
	passwordsIguales(pass1Name: string, pass2Name: string) {
		return (formGroup: FormGroup) => {
			const pass1Control = formGroup.get(pass1Name);
			const pass2Control = formGroup.get(pass2Name);
			if (pass1Control?.value === pass2Control?.value) {
				pass2Control?.setErrors(null);
			} else {
				pass2Control?.setErrors({ noEsIgual: true });
			}
		}
	}

}
