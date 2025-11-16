import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { SharedService } from '../modules/shared/service/shared.service';
import { isPlatformBrowser } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';


@Injectable()
export class CommonFunctionsService {

    /** Define Variables */
    private isBrowserSubject = new ReplaySubject<boolean>(0);
    public isBrowser = this.isBrowserSubject.asObservable();



    public sendData = new Subject<any>();
    env = environment;
    data: any = {};
    getSettingUrl: any = environment.SITE_URL + 'settings.json'


    /** Define Constructor */
    constructor(public sharedService: SharedService, @Inject(PLATFORM_ID) private platformId: object) {
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowserSubject.next(true);
        }
    }


/* @desc For used to get metabase dashboard details
 * @method getMetaDashboardDetails
 * @param formData
 * @return {methodUrl,data}
 */
  getMetaDashboardDetails = (formData:any,method:any): any => {
    const methodName =  method;
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData
    return this.sharedService.getPost(methodUrl, this.data);
  }
    /** 
     * @desc Function used to convert  phone number into dash format 000-000-0000
     * @method  convertPhoneNumber
     * @param {event}
     * @return {mobileNumberValue}
    */
    convertPhoneNumber(event: any) {
        const inputValue = event;
        // Remove any non-numeric characters
        const numericValue = inputValue.replace(/\D/g, '');
        // Format the numeric value with dashes
        const formattedValue = numericValue.replace(/(\d{3})(\d{1,3})(\d{1,4})/, '$1-$2-$3');
        return formattedValue;
    }
       /** 
     * @desc  Function used to update current user data 
     * @method updateCurrentUserData
     * @param {none}
     * @return {methodurl,data}
     */
       public updateCurrentUserData = (): any => {
        const methodName  = 'get_user_detail';
        const methodUrl   = environment.API_URL + methodName;
        return this.sharedService.getPost(methodUrl, this.data);
    }

        /** 
     * @desc  Function used to update admin user data
     * @method updateAdminUserData
     * @param {none}
     * @return {methodurl,data}
     */
       public updateAdminUserData = (): any => {
        const methodName  = 'get_user_detail_for_superadmin';
        const methodUrl   = environment.API_URL + methodName;
        return this.sharedService.getPost(methodUrl, this.data);
    }


      /** 
     * @desc  Function used to update general user data
     * @method updateGeneralUserData
     * @param {none}
     * @return {methodurl,data}
     */
       public updateGeneralUserData = (): any => {
        const methodName  = 'get_user_detail_for_general';
        const methodUrl   = environment.API_URL + methodName;
        return this.sharedService.getPost(methodUrl, this.data);
    }

    
      /** 
     * @desc  Function used to update organization user data
     * @method updateOrganizationUserData
     * @param {none}
     * @return {methodurl,data}
     */
       public updateOrganizationUserData = (): any => {
        const methodName  = 'get_user_detail_for_organization';
        const methodUrl   = environment.API_URL + methodName;
        return this.sharedService.getPost(methodUrl, this.data);
    }


     /* @desc  Function used to submit contact us page
     * @method contactUs
     * @param {none}
     * @return {methodurl,data}
     */
       public contactUs   = (formData:any): any => {
        const methodName  = 'save_contact_us';
        const methodUrl   = environment.API_URL + methodName;
        this.data['data'] = formData
        return this.sharedService.getPost(methodUrl, this.data);
    }


    
  
    /** 
     * @desc  Function used to get data from localstorage
     * @method getItem
     * @param {keys}
     * @return {data}
     */
    getItem = (key: any): any => {
        if (isPlatformBrowser(this.platformId)) {
            let data = localStorage.getItem(key);
            return data;
        }
    }



    /** 
     * @desc  Function used to set data into localstorage
     * @method setItem
     * @param {key,item}
     * @return {none}
     */
    public setItem(key: any, item: any): any {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, item);
            return;
        }
    }


    /** 
     * @desc  Function used to remove data from localstorage
     * @method removeItem
     * @param {key}
     * @return {none}
     */
    public removeItem(key: any): any {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
            return;
        }
    }
    /** 
 * @desc  Function used to clear all local storage data
 * @method clearAllLocalStorageData
 * @param {key}
 * @return {none}
 */
    public clearAllLocalStorageData(): any {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
            return;
        }
    }


 


     /** 
 * @desc For used to get organization metabase dashboard data
 * @method getOrganizationMetaBaseDashboard
 * @param formData
 * @return {methodUrl,data}
 */
  getMetaBaseDashboard = (): any => {
    const methodName = 'get_metabase_dashbord';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = {}
    return this.sharedService.getPost(methodUrl, this.data);
  }

   /** 
 * @desc For used to get super set dashboard list data
 * @method getSuperSetDashboardList
 * @param formData
 * @return {methodUrl,data}
 */
  getSuperSetDashboardList = (): any => {
    const methodName = 'get_superset_dashbord_list';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = {}
    return this.sharedService.getPost(methodUrl, this.data);
  }

  
    /** 
   * @desc For used to change  password
   * @method changePassword
   * @param formData
   * @return {methodUrl,data}
   */
    changePassword = (formData:any): any => {
        const methodName = 'change_password_for_super_admin';
        const methodUrl = environment.API_URL + methodName;
        this.data['data'] = formData;
        return this.sharedService.getPost(methodUrl, this.data);
      }
  
   
       /** 
   * @desc For used to update  profile 
   * @method updateProfile
   * @param formData
   * @return {methodUrl,data}
   */
    updateProfile = (formData:any): any => {
        const methodName = 'edit_profile_super_admin';
        const methodUrl = environment.API_URL + methodName;
        this.data['data'] = formData;
        return this.sharedService.getPost(methodUrl, this.data);
      }



   

  
}