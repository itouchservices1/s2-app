/** Import Angular Built-In Packages and Custom Files and Services */
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../shared/service/shared.service';

@Injectable()

export class ViaAdminLoginService {

	/** Define Variables ***/
	data: any = {};

	/**Define constructor**/
	constructor(public sharedService: SharedService) {

	}

    /** 
 * @desc For used to login user by super admin
 * @method loginBySuperAdmin
 * @param formData
 * @return {methodUrl,data}
 */
  loginBySuperAdmin = (formData: any): any => {
    const methodName = 'login_by_super_admin';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }


}