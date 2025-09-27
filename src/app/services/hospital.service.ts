import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class HospitalService {

	constructor(private http: HttpClient) { }

	get token(): string {
		return localStorage.getItem('token') || '';
	}

	cargarHospitales(): Observable<any> {
		return this.http.get<any>(`${baseUrl}/hospitales`, {
			headers: {
				'x-token': this.token
			}
		}).pipe(
			map((resp: { ok: boolean, hospitales: Hospital[] }) => resp.hospitales)
		);
	}

	crearHospital(nombre: string): Observable<any> {
		const body = {
			nombre: nombre
		};
		return this.http.post<any>(`${baseUrl}/hospitales`, body, {
			headers: {
				'x-token': this.token
			}
		});
	}

	actualizarHospital(nombre: string, _id: string): Observable<any> {
		const body = {
			nombre: nombre
		};
		return this.http.put<any>(`${baseUrl}/hospitales/${_id}`, body, {
			headers: {
				'x-token': this.token
			}
		});
	}

	eliminarHospital(_id: string): Observable<any> {
		return this.http.delete<any>(`${baseUrl}/hospitales/${_id}`, {
			headers: {
				'x-token': this.token
			}
		});
	}
}
