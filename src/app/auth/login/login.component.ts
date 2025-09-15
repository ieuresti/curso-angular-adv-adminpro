import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'; // https://sweetalert2.github.io/

declare const google: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

	@ViewChild('googleBtn') googleBtn!: ElementRef;

	loginForm: FormGroup;
	formSubmitted = false;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private usuarioService: UsuarioService
	) {
		this.loginForm = this.fb.group({
			email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			remember: [false]
		});
	}

	/**
	 * Inicializa el botón de Google Sign-In después de que la vista ha sido inicializada.
	 * @returns void
	 */
	ngAfterViewInit(): void {
		this.googleInit();
	}

	/**
	 * Inicializa la autenticación de Google y renderiza el botón de Google Sign-In.
	 * @returns void
	 */
	googleInit() {
		google.accounts.id.initialize({
			client_id: "1013630041366-71hfr514cmibn2gkbj6o3ca7hfo4r8t3.apps.googleusercontent.com",
			callback: (response: any) => this.handleCredentialResponse(response)
		});
		google.accounts.id.renderButton(
			// document.getElementById("buttonDiv"),
			this.googleBtn.nativeElement,
			{ theme: "outline", size: "large" }  // customization attributes
		);
	}

	/**
	 * Maneja la respuesta de credenciales de Google Sign-In.
	 * @param response Respuesta con el token JWT de Google
	 * @returns void
	 */
	handleCredentialResponse(response: any) {
		this.usuarioService.loginGoogle(response.credential).subscribe({
			next: () => {
				this.router.navigateByUrl('/');
			},
			error: () => {
				Swal.fire({
					title: 'Error!',
					icon: 'error'
				})
			}
		});
	}

	ngOnInit(): void {
	}

	/**
	 * Verifica si un campo del formulario no es válido y ya se intentó enviar el formulario.
	 * @param campo Nombre del campo a validar
	 * @returns true si el campo es inválido y se intentó enviar el formulario
	 */
	campoNoValido(campo: string): boolean {
		if (this.loginForm.get(campo)?.invalid && this.formSubmitted) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Realiza el login de un usuario si sus credenciales existen y son correctas 
	 * @returns void
	 */
	onLogin() {
		this.formSubmitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		this.usuarioService.login(this.loginForm.value).subscribe({
			next: () => {
				Swal.fire({
					title: 'Login exitoso!',
					icon: 'success'
				})
				if (this.loginForm.get('remember')?.value) {
					localStorage.setItem('email', this.loginForm.get('email')?.value);
				} else {
					localStorage.removeItem('email');
				}
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

}
