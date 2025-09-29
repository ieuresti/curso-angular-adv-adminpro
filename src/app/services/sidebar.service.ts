import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	menu = [];

	cargarMenu() {
		this.menu = JSON.parse(localStorage.getItem('menu')) || [];
	}

	/* menu = [
		{
			titulo: 'Principal',
			icono: 'mdi mdi-gauge',
			submenu: [
				{ titulo: 'Dashboard', url: ''},
				{ titulo: 'Progress Bar', url: 'progress'},
				{ titulo: 'Gráficas', url: 'grafica1'},
				{ titulo: 'Promesas', url: 'promesas' },
				{ titulo: 'Rxjs', url: 'rxjs' }
			]
		},
		{
			titulo: 'Mantenimiento',
			icono: 'mdi mdi-folder-lock-open',
			submenu: [
				{ titulo: 'Usuarios', url: 'usuarios'},
				{ titulo: 'Hospitales', url: 'hospitales'},
				{ titulo: 'Medicos', url: 'medicos'}
			]
		}
	]; */

	constructor() { }
}
