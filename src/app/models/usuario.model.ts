import { environment } from '../../environments/environment';

const base_url = environment.baseUrl;

export class Usuario {
	public nombre: string;
	public email: string;
	public password?: string;
	public img?: string;
	public google?: boolean;
	public role?: string;
	public uid?: string;

	constructor(obj?: {
		nombre?: string;
		email?: string;
		password?: string;
		img?: string;
		google?: boolean;
		role?: string;
		uid?: string;
	}) {
		this.nombre = obj?.nombre ?? '';
		this.email = obj?.email ?? '';
		this.password = obj?.password;
		this.img = obj?.img;
		this.google = obj?.google;
		this.role = obj?.role;
		this.uid = obj?.uid;
	}

	get imagenUrl() {
		if (this.img.includes('https')) {
			return this.img;
		}

		if (this.img) {
			return `${base_url}/upload/usuarios/${this.img}`;
		} else {
			return `${base_url}/upload/usuarios/no-image`;
		}
	}
}