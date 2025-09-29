import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

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

	private transformarHospitales(resultados: any[]): Hospital[] {
		return resultados.map(
			resp => new Hospital(resp.nombre, resp._id, resp.img, resp.usuario)
		);
	}

	private transformarMedicos(resultados: any[]): Medico[] {
		return resultados;
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
						return this.transformarMedicos(resp.resultados);
					case 'hospitales':
						return this.transformarHospitales(resp.resultados);
					default:
						return [];
				}
			})
		);
	}

	busquedaGlobal(termino: string): Observable<any> {
		return this.http.get<any>(`${baseUrl}/todo/${termino}`, {
			headers: {
				'x-token': this.token
			}
		});
	}
}
