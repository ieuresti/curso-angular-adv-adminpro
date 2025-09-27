import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-hospitales',
	templateUrl: './hospitales.component.html',
	styles: [
	]
})
export class HospitalesComponent implements OnInit, OnDestroy {

	hospitales: Hospital[] = [];
	hospitalesTemp: Hospital[] = [];
	cargando = true;
	imgSubs: Subscription;

	constructor(
		private hospitalService: HospitalService,
		private modalImagenService: ModalImagenService,
		private busquedasService: BusquedasService
	) { }

	ngOnDestroy(): void {
		this.imgSubs.unsubscribe();
	}

	ngOnInit(): void {
		this.cargarHospitales();
		// cuando se actualize la img de la tabla se emitira la url de dicha img y llamara a cargarHospitales() para el refresh de la pagina
		this.imgSubs = this.modalImagenService.nuevaImagen
			.pipe(delay(100))
			.subscribe(img => this.cargarHospitales());
	}

	cargarHospitales() {
		this.cargando = true;
		this.hospitalService.cargarHospitales().subscribe({
			next: (resp) => {
				this.cargando = false;
				this.hospitales = resp;
				this.hospitalesTemp = resp;
			},
			error: (error) => {
				this.cargando = false;
				console.log(error);
			}
		});
	}

	crearHospital(nombre: string) {
		this.hospitalService.crearHospital(nombre).subscribe({
			next: () => {
				Swal.fire({
					title: 'Operación exitosa!',
					text: `El hospital ${nombre} ha sido creado exitosamente`,
					icon: 'success'
				});
				this.cargarHospitales();
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

	actualizarHospital(hospital: Hospital) {
		this.hospitalService.actualizarHospital(hospital.nombre, hospital._id).subscribe({
			next: () => {
				Swal.fire({
					title: 'Operación exitosa!',
					text: `El hospital ${hospital.nombre} se ha actualizado exitosamente`,
					icon: 'success'
				});
				this.cargarHospitales();
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

	eliminarHospital(hospital: Hospital) {
		this.hospitalService.eliminarHospital(hospital._id).subscribe({
			next: () => {
				Swal.fire({
					title: 'Hospital borrado!',
					text: `El hospital ${hospital.nombre} ha sido eliminado exitosamente`,
					icon: 'success'
				});
				this.cargarHospitales();
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

	async abrirModal() {
		const { value = '' } = await Swal.fire<string>({
			title: "Crear hospital",
			input: "text",
			inputLabel: "Nombre del hospital",
			inputPlaceholder: "Ingresa el nombre del nuevo hospital",
			showCancelButton: true
		});

		if (value.length === 0) {
			Swal.fire({
				title: "Error",
				text: "El nombre del hospital es obligatorio",
				icon: "error"
			});
			return;
		}

		this.crearHospital(value);
	}

	abrirModalImagen(hospital: Hospital) {
		this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
	}

	buscar(termino: string) {
		const tipoBusqueda = 'hospitales';

		if (termino.length === 0) {
			this.hospitales = this.hospitalesTemp;
			return;
		}

		this.busquedasService.buscar(tipoBusqueda, termino).subscribe({
			next: (resp) => {
				this.hospitales = resp;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

}
