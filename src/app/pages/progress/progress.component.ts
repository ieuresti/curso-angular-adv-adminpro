import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

	progreso1 = 15;
	progreso2 = 45;

	constructor() { }

	ngOnInit() {
	}

	get getProgreso1() {
		return `${this.progreso1}%`;
	}

	get getProgreso2() {
		return `${this.progreso2}%`;
	}

}
