import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/service/shared.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

      /** Define Variables */
    
      data    : any = {};
  constructor(public sharedService: SharedService) { }


      /** 
     * @desc For used to login user
     * @method LoginUser
     * @param formData
     * @return {methodUrl,data}
     */
      LoginUser = (formData: any): any => {
        const methodName    = 'super_admin_login';
        const methodUrl     = environment.API_URL + methodName;
        this.data['data']   = formData;
        return this.sharedService.getPost(methodUrl, this.data);
    }
}
