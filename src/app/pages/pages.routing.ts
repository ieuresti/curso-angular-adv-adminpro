import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
	{
		// Ruta principal
		path: 'dashboard',
		component: PagesComponent,
		canActivate: [AuthGuard],
		canLoad: [AuthGuard],
		// Lazy load
		loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule { }
