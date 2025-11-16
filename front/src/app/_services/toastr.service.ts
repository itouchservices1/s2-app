/** Import Angular Built-In Packages and Custom Files and Services */

import { Injectable,PLATFORM_ID,Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class NgxToasterService {
  
  /** Define Constructor */
  constructor(private toastr: ToastrService,@Inject(PLATFORM_ID) private platformId: object) { }
  
  /** For Show sucess  notification */
  showSuccess(message:any){
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.success(message)
    }
      
  }
  
  /** For Show error  notification */
  showError(message:any){
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.error(message)
    }
  }
  
  /** For Show info  notification */
  showInfo(message:any){
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.info(message)
    }
  }
  
  /** For Show warning  notification */
  showWarning(message:any){
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.warning(message)
    }
  }
  
}
