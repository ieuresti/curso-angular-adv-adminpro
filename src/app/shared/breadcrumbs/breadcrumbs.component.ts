import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
	selector: 'app-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styles: [
	]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

	pageTitle = '';
	titleSubs$: Subscription;

	constructor(private router: Router) {
		this.titleSubs$ = this.getPageTitle()
			.subscribe(data => {
				this.pageTitle = data['titulo'];
				document.title = `AdminPro - ${this.pageTitle}`;
			});
	}

	ngOnDestroy(): void {
		this.titleSubs$.unsubscribe();
	}

	ngOnInit(): void {
	}

	getPageTitle() {
		return this.router.events.
			pipe(
				// Filtar los eventos que son de tipo ActivationEnd y que no tienen hijos
				filter((event: any) =>
					event instanceof ActivationEnd &&
					event.snapshot.firstChild === null
				),
				// Extraer del evento solo el objeto de data
				map((event: ActivationEnd) => event.snapshot.data)
			);
	}

}
