import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styles: [
	]
})
export class UsuariosComponent implements OnInit, OnDestroy {

	totalUsuarios = 0;
	totalUsuariosTemp = 0;
	usuarios: Usuario[] = [];
	usuariosTemp: Usuario[] = [];
	paginaDesde = 0;
	cargando = true;
	imgSubs: Subscription;

	constructor(
		private usuarioService: UsuarioService,
		private busquedasService: BusquedasService,
		private modalImagenService: ModalImagenService
	) { }

	ngOnDestroy(): void {
		this.imgSubs.unsubscribe();
	}

	ngOnInit(): void {
		this.cargarUsuarios();
		// cuando se actualize la img de la tabla se emitira la url de dicha img y llamara a cargarUsarios() para el refresh de la pagina
		this.imgSubs = this.modalImagenService.nuevaImagen
			.pipe(delay(100))
			.subscribe(img => this.cargarUsuarios());
	}

	cargarUsuarios() {
		this.cargando = true;
		this.usuarioService.cargarUsuarios(this.paginaDesde).subscribe({
			next: (resp) => {
				this.cargando = false;
				this.totalUsuarios = resp.totalRegistros;
				this.totalUsuariosTemp = resp.totalRegistros;
				if (resp.usuarios.length !== 0) {
					this.usuarios = resp.usuarios;
					this.usuariosTemp = resp.usuarios;
				}
			},
			error: (error) => {
				this.cargando = false;
				console.log(error);
			}
		});
	}

	buscar(termino: string) {
		const tipoBusqueda = 'usuarios';

		if (termino.length === 0) {
			this.usuarios = this.usuariosTemp;
			this.totalUsuarios = this.totalUsuariosTemp;
			return;
		}

		this.busquedasService.buscar(tipoBusqueda, termino).subscribe({
			next: (resp) => {
				this.totalUsuarios = resp.length;
				this.usuarios = resp;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	eliminarUsuario(usuario: Usuario) {
		if (usuario.uid === this.usuarioService.uid) {
			Swal.fire({
				title: "Error",
				text: "No puede eliminarse a si mismo",
				icon: "error"
			});
			return;
		}

		Swal.fire({
			title: "¿Borrar usuario?",
			text: `Estás a punto de eliminar a ${usuario.nombre}`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirmar"
		}).then((result) => {
			if (result.isConfirmed) {
				this.usuarioService.eliminarUsuario(usuario).subscribe({
					next: () => {
						Swal.fire({
							title: "Usuario borrado!",
							text: `El usuario ${usuario.nombre} ha sido eliminado correctamente`,
							icon: "success"
						});
						this.cargarUsuarios();
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
		});
	}

	cambiarPagina(valor: number) {
		this.paginaDesde += valor;

		if (this.paginaDesde < 0) {
			this.paginaDesde = 0;
		} else if (this.paginaDesde > this.totalUsuarios) {
			this.paginaDesde -= valor;
		}

		this.cargarUsuarios();
	}

	cambiarRole(usuario: Usuario) {
		this.usuarioService.guardarUsuario(usuario).subscribe({
			next: () => {
				Swal.fire({
					title: 'Operación exitosa!',
					text: 'El Role se ha actualizado',
					icon: 'success'
				})
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

	abrirModalImagen(usuario: Usuario) {
		this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
	}

}
