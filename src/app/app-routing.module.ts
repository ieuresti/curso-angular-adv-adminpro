import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: '**', component: NotpagefoundComponent }
];

@NgModule({
	declarations: [],
	imports: [
		RouterModule.forRoot(routes),
		PagesRoutingModule, // Rutas(paths) componentes paginas autenticado
		AuthRoutingModule // Rutas(paths) componentes autenticacion
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
