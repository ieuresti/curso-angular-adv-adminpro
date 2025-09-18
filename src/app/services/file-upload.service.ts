import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class FileUploadService {

	constructor() { }

	async actualizarFoto(
		archivo: File,
		tipo: 'usuarios' | 'medicos' | 'hospitales',
		id: string
	) {
		try {
			const url = `${base_url}/upload/${tipo}/${id}`;
			// crear data para enviar al fetch
			const formData = new FormData();
			formData.append('imagen', archivo);

			// fetch permite hacer peticiones http de manera facil
			const resp = await fetch(url, {
				method: 'PUT',
				headers: {
					'x-token': localStorage.getItem('token') || ''
				},
				body: formData
			});

			const data = await resp.json();
			if (data.ok) {
				console.log(data);
				return data.nombreArchivo;
			} else {
				return false;
			}
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
