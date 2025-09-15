import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';

declare const google: any;
const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {

	constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { }

	/**
	 * Verifica si el token almacenado es válido haciendo una petición al backend
	 * @returns true si es válido y actualiza el token, caso contrario retorna false
	 */
	validarToken(): Observable<boolean> {
		const token = localStorage.getItem('token') || '';
		return this.http.get<any>(`${baseUrl}/login/renew`, {
			headers: {
				'x-token': token
			}
			// encadena operadores RxJS para procesar la respuesta del observable
		}).pipe(
			// si la petición es exitosa, guarda el nuevo token recibido en la respuesta en el localStorage
			tap(resp => {
				localStorage.setItem('token', resp.token)
			}),
			// transforma la respuesta para que el observable emita siempre true si la petición fue exitosa
			map(resp => true),
			// si ocurre un error (ejemplo, el token no es válido), el observable emitirá false
			catchError(error => of(false))
		);
	}

	crearUsuario(formData: RegisterForm): Observable<any> {
		return this.http.post<any>(`${baseUrl}/usuarios`, formData).pipe(
			// permite ejecutar efectos secundarios (side effects) en una secuencia de observables (Ejecutar acciones que no afectan el flujo de datos)
			tap(
				(resp) => { localStorage.setItem('token', resp.token) }
			)
		);
	}

	login(formData: LoginForm): Observable<any> {
		return this.http.post<any>(`${baseUrl}/login`, formData).pipe(
			tap(
				(resp) => { localStorage.setItem('token', resp.token) }
			)
		);
	}

	loginGoogle(token: string): Observable<any> {
		return this.http.post<any>(`${baseUrl}/login/google`, { token }).pipe(
			tap(
				(resp) => {
					localStorage.setItem('token', resp.token),
					localStorage.setItem('email', resp.email)
				}
			)
		);
	}

	logout() {
		const email = localStorage.getItem('email') || '';
		google.accounts.id.revoke(email, () => {
			this.ngZone.run(() => {
				this.router.navigateByUrl('/login');
			})
			localStorage.removeItem('token');
			localStorage.removeItem('email');
		})
	}
}
