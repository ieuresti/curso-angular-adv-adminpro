import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-medicos',
	templateUrl: './medicos.component.html',
	styles: [
	]
})
export class MedicosComponent implements OnInit, OnDestroy {

	medicos: Medico[] = [];
	medicosTemp: Medico[] = [];
	cargando = true;
	imgSubs: Subscription;

	constructor(
		private medicoService: MedicoService,
		private modalImagenService: ModalImagenService,
		private busquedasService: BusquedasService
	) { }

	ngOnDestroy(): void {
		this.imgSubs.unsubscribe();
	}

	ngOnInit(): void {
		this.cargarMedicos();
		// cuando se actualize la img de la tabla se emitira la url de dicha img y llamara a cargarMedicos() para el refresh de la pagina
		this.imgSubs = this.modalImagenService.nuevaImagen
			.pipe(delay(100))
			.subscribe(img => this.cargarMedicos());
	}

	cargarMedicos() {
		this.medicoService.cargarMedicos().subscribe({
			next: (resp) => {
				this.cargando = false;
				this.medicos = resp;
				this.medicosTemp = resp;
			},
			error: (error) => {
				this.cargando = false;
				console.log(error);
			}
		});
	}

	eliminarHospital(medico: Medico) {
		this.medicoService.eliminarMedico(medico._id).subscribe({
			next: () => {
				Swal.fire({
					title: 'Médico borrado!',
					text: `El médico ${medico.nombre} ha sido eliminado exitosamente`,
					icon: 'success'
				});
				this.cargarMedicos();
			},
			error: (error) => {
				Swal.fire({
					title: 'Error!',
					text: error.error.msg,
					icon: 'error'
				})
			}
		});
	}

	abrirModalImagen(medico: Medico) {
		this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
	}

	buscar(termino: string) {
		const tipoBusqueda = 'medicos';

		if (termino.length === 0) {
			this.medicos = this.medicosTemp;
			return;
		}

		this.busquedasService.buscar(tipoBusqueda, termino).subscribe({
			next: (resp) => {
				this.medicos = resp;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
