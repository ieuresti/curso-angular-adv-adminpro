import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	defaultTheme = './assets/css/colors/default-dark.css';

	constructor() {
		this.defaultTheme = localStorage.getItem('theme') || this.defaultTheme;
		document.getElementById('theme')?.setAttribute('href', this.defaultTheme);
	}

	/**
	 * Changes the theme of the application
	 */
	changeTheme(theme: string) {
		const url = `./assets/css/colors/${theme}.css`;
		// get the element with the id 'theme' and change its href attribute to the new url
		document.getElementById('theme')?.setAttribute('href', url);
		localStorage.setItem('theme', url);

		this.checkCurrentTheme();
	}

	/**
	 * Checks which theme is currently active and adds the 'working' class to the corresponding element
	 */
	checkCurrentTheme() {
		// get all elements with the class 'selector'
		const links = document.querySelectorAll('.selector');
		links.forEach(element => {
			element.classList.remove('working');
			// get the value of the attribute 'data-theme'
			const btnTheme = element.getAttribute('data-theme');
			const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
			const currentTheme = localStorage.getItem('theme');

			if (btnThemeUrl === currentTheme) {
				element.classList.add('working');
			}
		});
	}
}
