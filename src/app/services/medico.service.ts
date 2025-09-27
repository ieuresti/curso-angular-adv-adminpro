import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class MedicoService {

	constructor(private http: HttpClient) { }

	get token(): string {
		return localStorage.getItem('token') || '';
	}

	cargarMedicos(): Observable<any> {
		return this.http.get<any>(`${baseUrl}/medicos`, {
			headers: {
				'x-token': this.token
			}
		}).pipe(
			map((resp: { ok: boolean, medicos: Medico[] }) => resp.medicos)
		);
	}

	crearMedico(medico: { nombre: string, hospital: string }): Observable<any> {
		return this.http.post<any>(`${baseUrl}/medicos`, medico, {
			headers: {
				'x-token': this.token
			}
		});
	}

	actualizarMedico(nombre: string, idMedico: string, idHospital: string): Observable<any> {
		const body = {
			nombre: nombre,
			hospital: idHospital
		};
		return this.http.put<any>(`${baseUrl}/medicos/${idMedico}`, body, {
			headers: {
				'x-token': this.token
			}
		});
	}

	getMedicoById(_id: string): Observable<any> {
		return this.http.get<any>(`${baseUrl}/medicos/${_id}`, {
			headers: {
				'x-token': this.token
			}
		});
	}

	eliminarMedico(_id: string): Observable<any> {
		return this.http.delete<any>(`${baseUrl}/medicos/${_id}`, {
			headers: {
				'x-token': this.token
			}
		});
	}
}
