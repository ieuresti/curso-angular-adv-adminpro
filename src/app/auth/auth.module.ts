import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [
		LoginComponent,
		RegisterComponent
	],
	exports: [
		LoginComponent,
		RegisterComponent
	],
	imports: [
		RouterModule,
		FormsModule,
		CommonModule,
		ReactiveFormsModule,
		HttpClientModule
	]
})
export class AuthModule { }
