import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-promesas',
	templateUrl: './promesas.component.html',
	styles: [
	]
})
export class PromesasComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
		/* const promesa = new Promise((resolve, reject) => {

			if (true) {
				resolve('Promesa ejecutada');
			} else {
				reject('Algo salio mal...');
			}

		});

		promesa.then((mensaje) => {
			console.log(mensaje + ': ' + 'Terminó la promesa');
		})
		.catch(error => console.log('Error en la promesa: ', error));

		console.log('Fin del onInit'); */

		this.getUsuarios().then(usuarios => {
			console.log(usuarios);
		});
	}

	getUsuarios() {
		return new Promise((resolve) => {
			// realiza la peticion a la API
			fetch('https://reqres.in/api/users', {
				headers: {
					'x-api-key': 'reqres-free-v1'
				}
			})
			// obtiene la respuesta y la convierte a JSON
			.then(resp => resp.json())
			.then(body => resolve(body.data));
		});
	}

}
