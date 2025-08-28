import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
	selector: 'app-dona',
	templateUrl: './dona.component.html',
	styles: [
	]
})
export class DonaComponent implements OnInit {

	// Documentacion ng2-charts: https://valor-software.com/ng2-charts/
	@Input() title = 'Sin titulo';
	@Input() labels: string[] = [];
	@Input() data: ChartData<ChartType> = { labels: [], datasets: [] };
	@Input() type: ChartType = 'doughnut';

	constructor() { }

	ngOnInit(): void {
	}

}
