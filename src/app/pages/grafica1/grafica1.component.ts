import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
	selector: 'app-grafica1',
	templateUrl: './grafica1.component.html',

})
export class Grafica1Component implements OnInit {

	// Documentacion ng2-charts: https://valor-software.com/ng2-charts/
	labels1: string[] = [
		'Enero',
		'Junio',
		'Diciembre',
	];
	data1: ChartData<'doughnut'> = {
		labels: this.labels1,
		datasets: [
			{ data: [150, 200, 250], backgroundColor: ['#fc0f03', '#35fc03', '#0328fc'] }
		],
	};
	chartType1: ChartType = 'doughnut';

	labels2: string[] = [
		'Objeto 1',
		'Objeto 2',
		'Objeto 3',
	];
	data2: ChartData<'doughnut'> = {
		labels: this.labels2,
		datasets: [
			{ data: [300, 150, 300], backgroundColor: ['#fce303', '#ce03fc', '#0cf71c'] }
		],
	};

	labels3: string[] = [
		'Electrodomesticos',
		'Comida',
		'Muebles',
	];
	data3: ChartData<'doughnut'> = {
		labels: this.labels3,
		datasets: [
			{ data: [2500, 1400, 1800], backgroundColor: ['#f58d1d', '#17e8e8', '#f2071f'] }
		],
	};

	labels4: string[] = [
		'PAN',
		'PRI',
		'Morena',
	];
	data4: ChartData<'doughnut'> = {
		labels: this.labels4,
		datasets: [
			{ data: [500, 700, 300], backgroundColor: ['#1c18de', '#f765d0', '#068f53'] }
		],
	};

	constructor() { }

	ngOnInit(): void {
	}

}
