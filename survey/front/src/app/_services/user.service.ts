import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../core/user.module';
import { CommonFunctionsService } from '../_services/commonFunctions.service';
import { NgxToasterService } from '../_services/toastr.service';
import { TextSetting } from '../textsetting';
import { Router } from '@angular/router';
import { ERROR_MESSAGES } from '../global-error';



@Injectable()
export class UserService {
	
    /** Define variables */
    private ngUnsubscribe		: Subject <void> = new Subject <void> ();
    private currentUserSubject 					 = new BehaviorSubject < User > ({} as User);
    public currentUser 							 = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    private isAuthenticatedSubject  			 = new ReplaySubject < boolean > (1);
    public isAuthenticated 						 = this.isAuthenticatedSubject.asObservable();
    env 										 = environment;
    TextSetting 								 = TextSetting;
    errorMessage                                 = ERROR_MESSAGES;


    /** Define constructor */
    constructor(public commonFunctionsService: CommonFunctionsService, private toasterNotification: NgxToasterService, public router: Router, @Inject(PLATFORM_ID) private platformId: object) 
	{}

    /** 
     * @desc  Function used to get logged in user details
     * @method getCurrentUser
     * @param none
     * @return {currentUser}
     */
    getCurrentUser = (): any => {
        if (isPlatformBrowser(this.platformId)) {
            const currentUser: any | null | undefined = JSON.parse(localStorage.getItem('userData') || '{}');
            if (typeof currentUser !== undefined && currentUser != null) {
                return currentUser;
            } else {
                return currentUser;
            }
        } else {
            const currentUser: any = [];
            return currentUser;
        }
    }

    /** 
     * @desc  Function used to get social user login data
     * @method getSocialUserData
     * @param none
     * @return {currentUser}
     */
       getSocialUserData = (): any => {
        if (isPlatformBrowser(this.platformId)) {
            const currentUser: any | null | undefined = JSON.parse(localStorage.getItem('socialData') || '{}');
            if (typeof currentUser !== undefined && currentUser != null) {
                return currentUser;
            } else {
                return currentUser;
            }
        } else {
            const currentUser: any = [];
            return currentUser;
        }
    }

  



    /** 
     * @desc  Function used to update local storage data of current user
     * @method updateCurrentUserData
     * @param none
     * @return {none}
     */
     updateCurrentUserData = (): void => {

        if (this.getCurrentUser() != 'undefined' && this.getCurrentUser() != null) {
          
        
            this.commonFunctionsService.updateCurrentUserData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
                if (res.status === this.env.SUCCESS_STATUS) {
                    const loginuserData = res.result;
                    if (loginuserData.is_deleted == this.env.IS_DELETED || loginuserData.is_active == this.env.SUSPEND) {
                        this.purgeAuth();
                        this.toasterNotification.showError(this.errorMessage.forcelogoutError);
                        this.router.navigate(['/login']);
                    } else {
                        this.commonFunctionsService.setItem('userData', JSON.stringify(loginuserData))
                     

                    }
                }
            });

             
        }
    }

  



    /** 
     * @desc  Function used to check login user is deleted ,suspended or active 
     * @method checkUserAccess
     * @param none
     * @return {none}
     */
     checkUserAccess = (): void => {
        if (this.getCurrentUser() != 'undefined' && this.getCurrentUser() != null) {
            if (this.getCurrentUser().is_deleted == this.env.IS_DELETED || this.getCurrentUser().is_active == this.env.SUSPEND || this.getCurrentUser().is_verifed_before_or_after_seven_days==true) {
                this.purgeAuth();
                this.toasterNotification.showError(this.errorMessage.forcelogoutError);
                this.router.navigate(['/']);
            }
        }
    }


    /** 
     * @desc  Verify JWT in localstorage with server & load user's info(This runs once on application startup)
     * @method populate
     * @param none
     * @return {none}
     */
    populate = (): void => {

        // If JWT detected, attempt to get & store user's info
        if (isPlatformBrowser(this.platformId)) {
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            if (typeof currentUser !== undefined && currentUser != null) {
                this.setAuth(currentUser);
            } else {
                // Remove any potential remnants of previous auth states
                this.purgeAuth();
            }
        }
    }


    /** 
     * @desc  For used to set local storage data
     * @method setAuth
     * @param none
     * @return {none}
     */
    setAuth = (user: User): void => {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userData', JSON.stringify(user));
            // Set current user data into observable
            this.currentUserSubject.next(user);
            // Set isAuthenticated to true
            this.isAuthenticatedSubject.next(true);
        }
    }


    /** 
     * @desc  For used to remove all localstorage data of user
     * @method purgeAuth
     * @param none
     * @return {none}
     */
    purgeAuth = (): void => {

        if (isPlatformBrowser(this.platformId)) {
            // Remove user data from localstorage
            localStorage.removeItem('socialData');
            localStorage.removeItem('slug');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userTokenTime');
            localStorage.removeItem('userData');
            localStorage.removeItem('user_email');
            localStorage.removeItem('userPlanData');
            // Set current user to an empty object
            this.currentUserSubject.next({} as User);
            // Set auth status to false
            this.isAuthenticatedSubject.next(false);
        }
    }

    /** 
     * @desc  Function is used to set token on local storage
     * @method setToken
     * @param none
     * @return {none}
     */
    setToken = (token: any): void => {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', JSON.stringify(token));
        }
    }


    /** 
     * @desc  Function is used to set expire time in local storage
     * @method setTokenExpireTime
     * @param expireTime
     * @return {none}
     */
    setTokenExpireTime = (expireTime: any): void => {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userTokenTime', JSON.stringify(expireTime));
        }
    }

    /** 
     * @desc  Function is used to set refresh token in local storage
     * @method setRefreshToken
     * @param refreshToken
     * @return {none}
     */
    setRefreshToken = (refreshToken: any): void => {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
        }
    }
}
