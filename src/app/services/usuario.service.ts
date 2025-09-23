import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any;
const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {

	usuario = new Usuario();

	constructor(private http: HttpClient, private router: Router) {
		google.accounts.id.initialize({
			client_id: '1013630041366-71hfr514cmibn2gkbj6o3ca7hfo4r8t3.apps.googleusercontent.com',
			callback: () => { }
		});
	}

	get token(): string {
		return localStorage.getItem('token') || '';
	}

	get uid(): string {
		return this.usuario.uid || '';
	}

	/**
	 * Verifica si el token almacenado es válido haciendo una petición al backend
	 * @returns true si es válido y actualiza el token, caso contrario retorna false
	 */
	validarToken(): Observable<boolean> {
		return this.http.get<any>(`${baseUrl}/login/renew`, {
			headers: {
				'x-token': this.token
			}
			// encadena operadores RxJS para procesar la respuesta del observable
		}).pipe(
			// si la petición es exitosa, guarda el nuevo token recibido en la respuesta en el localStorage
			// transforma la respuesta para que el observable emita siempre true si la petición fue exitosa
			map(resp => {
				const { email, google, img = '', nombre, role, uid } = resp.usuario;
				this.usuario = new Usuario({ nombre: nombre, email: email, password: '', img: img, google: google, role: role, uid: uid });
				localStorage.setItem('token', resp.token);
				return true;
			}),
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

	actualizarPerfil(data: { email: string, nombre: string, role?: string }): Observable<any> {
		data = {
			...data,
			role: this.usuario.role
		}
		return this.http.put<any>(`${baseUrl}/usuarios/${this.uid}`, data, {
			headers: {
				'x-token': this.token
			}
		});
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

		if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
			google.accounts.id.revoke(email, () => {
				this.router.navigateByUrl('/login');
				localStorage.removeItem('token');
				localStorage.removeItem('email');
			});
		}
	}

	cargarUsuarios(desde: number = 0): Observable<any> {
		return this.http.get<any>(`${baseUrl}/usuarios?desde=${desde}`, {
			headers: {
				'x-token': this.token
			}
		}).pipe(
			map(resp => {
				const usuarios = resp.usuarios.map(
					user => new Usuario({ nombre: user.nombre, email: user.email, password: '', img: user.img, google: user.google, role: user.role, uid: user.uid })
				);
				return { usuarios, totalRegistros: resp.totalRegistros };
			})
		);
	}

	guardarUsuario(usuario: Usuario): Observable<any> {
		return this.http.put<any>(`${baseUrl}/usuarios/${usuario.uid}`, usuario, {
			headers: {
				'x-token': this.token
			}
		});
	}

	eliminarUsuario(usuario: Usuario): Observable<any> {
		return this.http.delete<any>(`${baseUrl}/usuarios/${usuario.uid}`, {
			headers: {
				'x-token': this.token
			}
		});
	}
}
