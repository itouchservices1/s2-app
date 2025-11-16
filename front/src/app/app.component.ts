
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
	/**Define Constructor*/
	constructor(public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {

	}

  	/**This function is used when any page open then sctoll to top*/
	onActivate() {
		if (isPlatformBrowser(this.platformId)) {
			window.scrollTo(0, 0);
		}
	}
}
