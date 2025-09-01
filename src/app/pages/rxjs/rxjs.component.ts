import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, interval, map, Observable, retry, Subscription, take } from 'rxjs';

@Component({
	selector: 'app-rxjs',
	templateUrl: './rxjs.component.html',
	styles: [
	]
})
export class RxjsComponent implements OnInit, OnDestroy {

	intervalSubs: Subscription;

	constructor() {
		// el pipe es una forma de transformar la informacion que fluye a traves del observable
		// no solo es transformar, tambien puede reintentar hacer algo
		/* this.retornaObservable().pipe(
			retry(1)
		).subscribe({
			next: valor => console.log('Valor: ', valor),
			error: error => console.error('Error en el observable', error),
			complete: () => console.info('El observable ha terminado!!!')
		}); */

		this.intervalSubs = this.retornaInterval().subscribe(data => console.log(data));
	}

	/**
	 * Llamar esto con observables que siempre estan emitiendo valores para evitar memory leaks
	 */
	ngOnDestroy(): void {
		this.intervalSubs.unsubscribe();
	}

	ngOnInit() {
	}

	retornaInterval(): Observable<number> {
		return interval(100).pipe(
			// el take limita la cantidad de emisiones que va a hacer el observable y luego se completa
			// take(10),
			// el map sirve para transformar la info que recibe el observable y mutarla de la manera que yo necesito 
			map(valor => valor + 1),
			// el filter filtra la info que recibe el observable y deja pasar solo la info que yo necesito
			// en este caso solo deja pasar los numeros pares
			filter(valor => (valor % 2 === 0) ? true : false)
		);
	}

	retornaObservable(): Observable<number> {
		let i = -1;

		return new Observable<number>(observer => {
			const interval = setInterval(() => {
				i++;
				// next emite el valor para el observable
				observer.next(i);

				if (i === 4) {
					clearInterval(interval);
					// indicar que el observable ha terminado
					observer.complete();
				} else if (i === 2) {
					// indicar que hubo un error
					observer.error('i llegó al valor de 2');
				}
			}, 1000);

		});
	}

}
