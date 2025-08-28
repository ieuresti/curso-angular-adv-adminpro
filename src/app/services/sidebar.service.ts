import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	menu = [
		{
			titulo: 'Principal',
			icono: 'mdi mdi-gauge',
			submenu: [
				{ titulo: 'Dashboard', url: ''},
				{ titulo: 'Progress Bar', url: 'progress'},
				{ titulo: 'Gráficas', url: 'grafica1'}
			]
		}
	];

	constructor() { }
}
