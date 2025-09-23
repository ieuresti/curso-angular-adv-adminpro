import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class BusquedasService {

	constructor(private http: HttpClient) { }

	get token(): string {
		return localStorage.getItem('token') || '';
	}

	private transformarUsuarios(resultados: any[]): Usuario[] {
		return resultados.map(
			resp => new Usuario({ nombre: resp.nombre, email: resp.email, password: '', img: resp.img, google: resp.google, role: resp.role, uid: resp.uid })
		);
	}

	buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', terminoBusqueda: string): Observable<any> {
		return this.http.get<any>(`${baseUrl}/todo/coleccion/${tipo}/${terminoBusqueda}`, {
			headers: {
				'x-token': this.token
			}
		}).pipe(
			map(resp => {
				switch (tipo) {
					case 'usuarios':
						return this.transformarUsuarios(resp.resultados);
					case 'medicos':
						return this.transformarUsuarios(resp.resultados);
					case 'hospitales':
						return this.transformarUsuarios(resp.resultados);
					default:
						return [];
				}
			})
		);
	}
}
