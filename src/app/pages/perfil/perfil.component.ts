import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'; // https://sweetalert2.github.io/

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styles: [
	]
})
export class PerfilComponent implements OnInit {

	perfilForm: FormGroup;
	usuario: Usuario;
	imgSubir: File;
	imgTemp: any = '';

	constructor(
		private fb: FormBuilder,
		private usuarioService: UsuarioService,
		private fileUploadService: FileUploadService
	) {
		this.usuario = this.usuarioService.usuario;
		this.perfilForm = this.fb.group({
			nombre: [this.usuario.nombre, Validators.required],
			email: [this.usuario.email, [Validators.required, Validators.email]]
		});
	}

	ngOnInit(): void {
	}

	/**
	 * Actualiza el perfil del usuario con los datos del formulario.
	 */
	actualizarPerfil() {
		const data = {
			email: this.perfilForm.get('email').value,
			nombre: this.perfilForm.get('nombre').value
		}
		this.usuarioService.actualizarPerfil(data).subscribe({
			next: () => {
				Swal.fire({
					title: 'Guardado!',
					text: 'Cambios fueron guardados',
					icon: 'success'
				})
				const { nombre, email } = this.perfilForm.value;
				this.usuario.nombre = nombre;
				this.usuario.email = email;
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
		this.fileUploadService.actualizarFoto(this.imgSubir, 'usuarios', this.usuario.uid)
			.then(img => {
				this.usuario.img = img
				Swal.fire({
					title: 'Guardado!',
					text: 'Cambios fueron guardados',
					icon: 'success'
				})
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
