import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
	declarations: [
		AppComponent,
		NotpagefoundComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule, // Rutas principales
		PagesModule, // Componentes de las paginas (autenticado)
		AuthModule // Componentes de autenticacion (login, register...)
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
