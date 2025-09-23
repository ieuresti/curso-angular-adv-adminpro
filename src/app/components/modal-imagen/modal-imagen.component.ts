import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-modal-imagen',
	templateUrl: './modal-imagen.component.html',
	styles: [
	]
})
export class ModalImagenComponent implements OnInit {

	imgSubir: File;
	imgTemp: any = '';

	constructor(
		public modalImagenService: ModalImagenService,
		private fileUploadService: FileUploadService
	) { }

	ngOnInit(): void {
	}

	cerrarModal() {
		this.imgTemp = null;
		this.modalImagenService.cerrarModal();
	}

	/**
	 * Selecciona una imagen para subir y la almacena en la propiedad imgSubir.
	 * @param file Archivo de imagen seleccionado
	 */
	seleccionarImagen(file: File) {
		this.imgSubir = file;

		if (!file) {
			return this.imgTemp = null;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			this.imgTemp = reader.result;
		}
	}

	/**
	* Sube la imagen seleccionada al servidor usando el servicio de FileUpload.
	*/
	subirImagen() {
		const id = this.modalImagenService.id;
		const tipo = this.modalImagenService.tipo;
		this.fileUploadService.actualizarFoto(this.imgSubir, tipo, id)
			.then(img => {
				Swal.fire({
					title: 'Guardado!',
					text: 'Cambios fueron guardados',
					icon: 'success'
				});
				this.modalImagenService.nuevaImagen.emit(img);
				this.cerrarModal();
			})
			.catch(() => {
				Swal.fire({
					title: 'Error!',
					text: 'No fue posible actualizar la imagen',
					icon: 'error'
				})
			});
	}

}
