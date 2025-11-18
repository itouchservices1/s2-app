/** Import Angular Built-In Packages and Custom Files and Services */

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class NgxToasterService {

  /** Define Constructor */
  constructor(private toastr: ToastrService, @Inject(PLATFORM_ID) private platformId: object) {
    // Configuration for ngx-toastr options, applied only in the browser
    if (isPlatformBrowser(this.platformId)) {
      // How long the toast will display without user interaction (in milliseconds)
      // 15000ms = 15 seconds
      this.toastr.toastrConfig.timeOut = 15000;

      // How long the toast will display after a user hovers over it (in milliseconds)
      // 1000ms = 1 second
      this.toastr.toastrConfig.extendedTimeOut = 3000;
    }
  }

  /** For Show sucess  notification */
  showSuccess(message: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.success(message)
    }

  }

  /** For Show error  notification */
  showError(message: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.error(message)
    }
  }

  /** For Show info  notification */
  showInfo(message: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.info(message)
    }
  }

  /** For Show warning  notification */
  showWarning(message: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.warning(message)
    }
  }

}
