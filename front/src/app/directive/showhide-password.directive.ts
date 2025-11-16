import { Directive, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

/** From  directives, you can change the appearance or behavior of DOM elements and Angular components.**/
@Directive({
  selector: '[ShowHidePasswordDirective]',
  standalone: false
})
export class ShowHidePasswordDirective {
  /** Define Variable */
  private _shown: boolean = false;

  /** Define Constructor */
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to check platform
  ) {
    /** Ensure this code only runs in the browser */
    if (isPlatformBrowser(this.platformId)) {
      const parent = this.el.nativeElement.parentNode;
      const image = document.createElement('img');
      image.className = 'show-hide-password';
      image.setAttribute('src', environment.SITE_IMAGE_URL + 'show_view_icon.svg');
      image.addEventListener('click', () => {
        this.toggle(image);
      });
      parent.appendChild(image);
    }
  }

  /** For used to show or hide password */
  toggle(image: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      image.setAttribute('src', environment.SITE_IMAGE_URL + 'hide_view_icon.svg');
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      image.setAttribute('src', environment.SITE_IMAGE_URL + 'show_view_icon.svg');
    }
  }
}
