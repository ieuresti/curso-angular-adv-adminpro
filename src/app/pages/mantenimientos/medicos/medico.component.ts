import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-medico',
	templateUrl: './medico.component.html',
	styles: [
	]
})
export class MedicoComponent implements OnInit {

	medicoForm: FormGroup;
	medicoSeleccionado: Medico;
	hospitales: Hospital[] = [];
	hospitalSeleccionado: Hospital;
	medicoId: string;

	constructor(
		private fb: FormBuilder,
		private hospitalService: HospitalService,
		private medicoService: MedicoService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.activatedRoute.params.subscribe(
			(params) => {
				this.medicoId = params['id'];
			}
		);
	}

	ngOnInit(): void {
		if (this.medicoId !== 'nuevo') {
			this.getMedicoById();
		}

		this.medicoForm = this.fb.group({
			nombre: ['', Validators.required],
			hospital: ['', [Validators.required]]
		});

		this.cargarHospitales();

		this.medicoForm.get('hospital').valueChanges.subscribe(
			hospitalFormId => {
				this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalFormId);
			}
		);
	}

	getMedicoById() {
		this.medicoService.getMedicoById(this.medicoId).pipe(delay(100)).subscribe({
			next: (resp) => {
				const { nombre, hospital: { _id } } = resp.medico;
				this.medicoSeleccionado = resp.medico;
				this.medicoForm.controls['nombre'].setValue(nombre);
				this.medicoForm.controls['hospital'].setValue(_id);
			}
		});
	}

	cargarHospitales() {
		this.hospitalService.cargarHospitales().subscribe({
			next: (resp) => {
				this.hospitales = resp;
			},
			error: (error) => {
				Swal.fire({
					title: 'Error!',
					text: error.error.msg,
					icon: 'error'
				});
			}
		});
	}

	guardarMedico(formValues) {
		if (this.medicoSeleccionado) {
			this.actualizarMedico(formValues);
		} else {
			this.crearMedico(formValues);
		}
	}

	actualizarMedico(formValues) {
		this.medicoService.actualizarMedico(formValues.nombre, this.medicoId, formValues.hospital).subscribe({
			next: () => {
				Swal.fire({
					title: 'Operación exitosa!',
					text: `El médico ${formValues.nombre} se ha actualizado exitosamente`,
					icon: 'success'
				});
			},
			error: (error) => {
				Swal.fire({
					title: 'Error!',
					text: error.error.msg,
					icon: 'error'
				});
			}
		});
	}

	crearMedico(formValues) {
		const medico = {
			nombre: formValues.nombre,
			hospital: formValues.hospital
		};
		this.medicoService.crearMedico(medico).subscribe({
			next: (resp) => {
				Swal.fire({
					title: 'Operación exitosa!',
					text: `El médico ${medico.nombre} se ha creado exitosamente`,
					icon: 'success'
				});
				this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
			},
			error: (error) => {
				Swal.fire({
					title: 'Error!',
					text: error.error.msg,
					icon: 'error'
				});
			}
		});
	}
}
