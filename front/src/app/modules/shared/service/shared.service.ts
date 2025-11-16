import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EncrDecrService } from '../../../_services/encr-decr.service';
import { Buffer } from 'buffer';

 @Injectable()
 export class SharedService {
    /** Define Variables */
    env                 = environment;
    resp         : any = {};
    data         : any = {};

    /**Define constructor**/
    constructor(private router: Router, private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: object, public EncrDecr: EncrDecrService) 
    {}

    /** 
     * @desc  Function used to define request method
     * @method getRequest
     * @param requestUrl
     * @return {res}
     */
    public getRequest(requestUrl = ''): any {
        return this.httpClient.get(requestUrl).toPromise().then((res: any) => {
            return res;
        }).catch(this.handleError);
    }


    /** 
     * @desc  Function used to check device view type
     * @method deviceViewType
     * @param none
     * @return {none}
     */
    public deviceViewType() {
        let deviceType: string = '';

        if (isPlatformBrowser(this.platformId) && navigator) {
         
            if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
              deviceType = "ios";
            } else if (/Android/i.test(navigator.userAgent)) {
              deviceType = "android";
            } else {
              deviceType = "desktop";
            }

          }

          return deviceType;
     
      }


    /** 
     * @desc  Function used to define post method
     * @method getPost
     * @param {requestUrl,data}
     * @return {res}
     */
    public getPost(requestUrl = '', data: any): any {

        let loginUserSlug               : any = '';
        let device_view_type            : any = this.deviceViewType();
        if (isPlatformBrowser(this.platformId)) {
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            if (typeof currentUser !== 'undefined' && currentUser != null) {
                loginUserSlug = currentUser.slug;
            }
        }
        if (typeof data.data !== 'undefined') {
            data.data.slug = loginUserSlug;
        } else {
            data.data = {};
            data.data.slug = loginUserSlug;
        }
   
        data.device_id              = "";
        data.device_type            = "";
        
        const request               : any   = {};
        const jsonData                      = JSON.stringify(data);
        const encoded                       = this.utf8ToBase64(jsonData);


        if (this.env.ENCRIPT_API === 1) {
            const encrypted = this.EncrDecr.set(this.env.ENCRIPTION_KEY, encoded);
            request.req = encrypted;
        } else {
            if(!this.env.DEBUG_BASE64_DATA){
                request.req = jsonData;
                request.debug_json_view = 1
            }else{
                request.req = encoded;
            }
        }
        
        request.is_crypto           = this.env.ENCRIPT_API;
        request.api_type            = 'web';
        request.is_view_type        = device_view_type;
        return this.httpClient.post(requestUrl, request).pipe(map((res: any) => {
            let resp: any = {};
            if (this.env.ENCRIPT_API === 1) {
                const decrypted = this.EncrDecr.get(this.env.ENCRIPTION_KEY, res.response);
                resp = JSON.parse(this.base64ToUTF8(decrypted));
            } else {
                if(!this.env.DEBUG_BASE64_DATA){
                    resp = res.response;
                }else{
                    resp = JSON.parse(this.base64ToUTF8(res.response));
                }
            }
            return resp;
        }));
        
    }

   

     

  

    /**
     * @desc Convert a UTF-8 encoded string to base64.
     * @method utf8ToBase64
     * @param {str} - The UTF-8 encoded string to convert.
     * @returns {string} The base64-encoded string.
     */
    private utf8ToBase64(str: string): string {
        if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
            // Handle non-browser environment (e.g., SSR) using Node.js Buffer
            return Buffer.from(str, 'utf8').toString('base64');
        } else if (typeof btoa === 'function') {
            // Use browser's btoa function if available
            return btoa(unescape(encodeURIComponent(str)));
        }
        return ''; // Return an empty string in case neither method is available
    }



    /**
     *  @desc Convert a base64-encoded string to a UTF-8 string.
     *  @method  base64ToUTF8
     * @param {encodedData}  - The base64-encoded string to convert.
     * @returns {string} The UTF-8 string.
     */
    private base64ToUTF8(encodedData: string): string {
        if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
            // Handle non-browser environment (e.g., SSR) using Node.js Buffer
            return Buffer.from(encodedData, 'base64').toString('utf8');
        } else if (typeof atob === 'function') {
            // Use browser's atob function if available
            return decodeURIComponent(escape(atob(encodedData)));
        }
        return ''; // Return an empty string in case neither method is available
    }


    /** 
     * @desc  Function used to define post image method
     * @method getPostImage
     * @param {requestUrl,data}
     * @return {res}
     */
    public getPostImage(requestUrl = '', data: any): any {

        let loginUserSlug               : any = '';
        let device_view_type            : any = this.deviceViewType();


        if (isPlatformBrowser(this.platformId)) {
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            if (typeof currentUser !== 'undefined' && currentUser != null) {
                loginUserSlug = currentUser.slug;
            }
        }
        if (typeof(data.data) !== 'undefined') {
            data.data.slug  = loginUserSlug;
        } else {
            data.data       = {};
            data.data.slug  = loginUserSlug;
        }
        data.device_id                  = "";
        data.device_type                = "";
        data.device_token               = "";
        let documentImage       : any   = {};
        let file                : any   = [];
        const requestData       : any   = {};
        requestData.data                = data.data;
        requestData.method_name         = data.method_name;
        let jsonData                    = JSON.stringify(requestData);
        let jsonDataString              = Buffer.from(jsonData, 'utf8').toString('binary');
        const encoded                   = Buffer.from(jsonDataString, 'binary').toString('base64');
        const formData                  = new FormData();
        if (this.env.ENCRIPT_API === 1) {
            const encrypted = this.EncrDecr.set(this.env.ENCRIPTION_KEY, encoded);
            formData.append('req', encrypted);
        } else {
            if(!this.env.DEBUG_BASE64_DATA){
                formData.append('req', jsonData);
                formData.append('debug_json_view', '1');
            }else{
                formData.append('req', encoded);
            }
        }
        const is_crypt: any = this.env.ENCRIPT_API
        formData.append('is_crypto', is_crypt);
        formData.append('api_type', 'web');
        formData.append('is_view_type', device_view_type);
        if (data.profile_image !== undefined) {
            documentImage = data.profile_image;
            formData.append('profile_image', documentImage);
        }
        if (data.image !== undefined) {
            documentImage = data.image;
            formData.append('image', documentImage);
        }
       
        return this.httpClient.post(requestUrl, formData).pipe(map((res: any) => {
            let resp: any = {};
            if (this.env.ENCRIPT_API === 1) {
                const decrypted = this.EncrDecr.get(this.env.ENCRIPTION_KEY, res.response);
                resp = JSON.parse(Buffer.from(decrypted, 'base64').toString('utf8'));
            } else {
                if(!this.env.DEBUG_BASE64_DATA){
                    resp = res.response;
                }else{
                    resp = JSON.parse(Buffer.from(res.response, 'base64').toString('utf8'));
                }
            }
            return resp;
        }));

    }


    

   
    /** 
     * @desc  Function used to get token on each request
     * @method getToken
     * @param {none}
     * @return {refresh token}
     */
    public getToken(): any {
        let token               : any;
        let tokenExpireTime     : any;
        if (isPlatformBrowser(this.platformId)) {
            const userToken = JSON.parse(localStorage.getItem('token') || '{}');
           
            if (typeof userToken !== 'undefined' && userToken != null) {
                token = userToken;
            }
            tokenExpireTime = JSON.parse(localStorage.getItem('userTokenTime') || '{}');
        }
        const curentTime = new Date().getTime();
        let isTokenExpired: boolean = false;
        if (tokenExpireTime < curentTime && token !== '' && token != null) {
            isTokenExpired = true;
        }
        if (!isTokenExpired) {
            return of(token);
        }
        return this.refreshToken();
    }


    

    /** 
     * @desc  Function used to refresh token
     * @method refreshToken
     * @param {none}
     * @return {none}
     */
    refreshToken(): Observable <string> {

        const url       = environment.REFRESH_TOKEN_URL;
        /**append refresh token if you have one**/
        let refreshToken        : string = '';
        let expiredToken        : string = '';

        if (isPlatformBrowser(this.platformId)) {
            const userToken = JSON.parse(localStorage.getItem('token') || '{}');
            if (typeof userToken !== 'undefined' && userToken != null) {
                expiredToken = userToken;
            }
            const userRefreshToken = JSON.parse(localStorage.getItem('refresh_token') || '{}');
            if (typeof userRefreshToken !== 'undefined' && userRefreshToken != null) {
                refreshToken = userRefreshToken;
            }
        }
      
        return this.httpClient.get(url, {
            headers: new HttpHeaders().set('Authorization', `${refreshToken ? refreshToken : ''}`).set('token', expiredToken).set('authExempt', 'true'),
            observe: 'response'
        }).pipe(share(), // <========== YOU HAVE TO SHARE THIS OBSERVABLE TO AVOID MULTIPLE REQUEST BEING SENT SIMULTANEOUSLY
            map((res: any) => {
                const response = JSON.parse(Buffer.from(res.body.response, 'base64').toString('binary'));
                this.resp = response;
                if (this.resp.status === this.env.SUCCESS_STATUS) {
                    const token                 = this.resp.token;
                    const newRefreshToken       = this.resp.refresh_token;
                    const tokenExpireTime       = this.resp.token_life;
                    const currnow               = new Date().getTime();
                    const newTime               = currnow + (parseInt(tokenExpireTime) * 1000);
                    localStorage.setItem('userTokenTime', JSON.stringify(newTime));
                    localStorage.setItem('token', JSON.stringify(token));
                    localStorage.setItem('refresh_token', JSON.stringify(newRefreshToken));
                    return token;
                } else {
                    this.router.navigate(['/']);
                }
            }));
    }


       




    /** 
     * @desc  Function used to handle Error
     * @method handleError
     * @param {errpr response}
     * @return {errormessage}
     */
    private handleError(error: Response | any): any {
        return Promise.reject(error.message || error);
    }
}