import { Directive , HostListener,Renderer2} from '@angular/core';
import { Router} from '@angular/router';
import { environment } from '../../environments/environment';
import {CommonFunctionsService, NgxToasterService, UserService} from '../_services/index';
import { Subject,timer} from 'rxjs';



@Directive({
	selector: '[appLogout]',
    standalone:false
})

  export class LogoutDirective {

    /** For used to prevent memory Leaks */
    private ngUnsubscribe: Subject <void> = new Subject <void> ();
    /** For used to prevent memory Leaks */


    /**Define Variables */

    env                           = environment;
 


    constructor(public router: Router, public userService: UserService,private toasterNotification: NgxToasterService, private commonFunctionsService: CommonFunctionsService, private renderer: Renderer2) 
	{}



    @HostListener('click') onClick(): void {
        this.logout();

    }
    @HostListener('window:storage')

    
    /** 
     * @desc  Function used to log out user
     * @method onStorageChange
     * @param none
     * @return {none}
     */

    onStorageChange() {
		const currentUser 	=	this.userService.getCurrentUser();
        const currentUrl    =   this.router.url;
        if(!Object.keys(currentUser).length) {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([currentUrl]);
            });
        } 
 
     
    }

	
    /** 
     * @desc  Function used to log out user
     * @method logout
     * @param none
     * @return {none}
     */
    private logout(): void {
        this.commonFunctionsService.isBrowser.subscribe((isBrowser) => {
            if (isBrowser) {
              
                timer(1000).subscribe(() => {
                    this.userService.purgeAuth();
                    this.toasterNotification.showSuccess("You have successfully logout");
                    this.router.navigate(['/login']);
                })
            }
        });
    }


  

}