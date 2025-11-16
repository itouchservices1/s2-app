



import {Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { NgxToasterService, UserService } from '../_services/index';
import { timer } from 'rxjs';
import { ERROR_MESSAGES } from '../global-error';

@Injectable()
 export class AuthGuard implements CanActivate {
    /** Define Variables */
 
    env = environment;
    errorMessage = ERROR_MESSAGES;
    /** Define Constructor */

    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: object,private userService: UserService,private toasterNotification: NgxToasterService) {}
 

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

        const currentUser 	=	this.userService.getCurrentUser();
        if (Object.keys(currentUser).length !== 0) {
            return true;
        }
 
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
       
        if (isPlatformBrowser(this.platformId)) {
            timer(500).subscribe(() => {
                if (Object.keys(this.userService.getCurrentUser()).length == 0) {
                  this.toasterNotification.showError(this.errorMessage.INVALID_ACCESS_LOGIN);
                } 
            })
        }        
        return false;

}
	
}


