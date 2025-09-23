import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root'
})
export class ModalImagenService {

	private _ocultarModal = true;
	tipo: 'usuarios'|'medicos'|'hospitales';
	id: string;
	img: string;
	nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

	constructor() { }

	get token(): string {
		return localStorage.getItem('token') || '';
	}

	get ocultarModal() {
		return this._ocultarModal;
	}

	abrirModal(tipo: 'usuarios'|'medicos'|'hospitales', id: string, img = 'no-img') {
		this._ocultarModal = false;
		this.tipo = tipo;
		this.id = id;
		this.img = img;
		if (img.includes('https')) {
			this.img = img;
		} else {
			this.img = `${baseUrl}/upload/${tipo}/${img}`;
		}
	}

	cerrarModal() {
		this._ocultarModal = true;
	}
}
