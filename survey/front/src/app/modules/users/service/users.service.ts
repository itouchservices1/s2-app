import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../shared/service/shared.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /** Define Variables */

  data: any = {};
  constructor(public sharedService: SharedService) { }

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

  /** 
 * @desc For used to update super admin department
 * @method UpdateSuperAdminDepartment
 * @param formData
 * @return {methodUrl,data}
 */
  updateSuperAdminDepartment = (formData: any): any => {
    const methodName = 'update_super_admin_department';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
 * @desc For used to get organization list
 * @method getOrganizationList
 * @param formData
 * @return {methodUrl,data}
 */
  getOrganizationList = (): any => {
    const methodName = 'get_organization';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = {};
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
* @desc For used to get  edit organization list
* @method getEditOrganizationList
* @param formData
* @return {methodUrl,data}
*/
  getEditOrganizationList = (formData: any): any => {
    const methodName = 'get_organization';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
* @desc For used to get  users roles list
* @method getUsersRole
* @param formData
* @return {methodUrl,data}
*/
  getUsersRole = (): any => {
    const methodName = 'get_user_roles';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = {}
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
 * @desc For used to get department details
 * @method getDepartmentUserDetails
 * @param formData
 * @return {methodUrl,data}
 */
  getDepartmentUserDetails = (formData: any): any => {
    const methodName = 'get_department_user_detals';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
  * @desc For used to get organization list
  * @method getDepartmentListData
  * @param formData
  * @return {methodUrl,data}
  */
  getDepartmentListData = (formData: any): any => {
    const methodName = 'get_department_user_list';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
  * @desc For used to add department/user
  * @method addDepartment
  * @param formData
  * @return {methodUrl,data}
  */
  addDepartment = (formData: any): any => {
    const methodName = 'add_super_admin_department';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
  * @desc For used to active/deactive user
  * @method activeDeactiveUser
  * @param formData
  * @return {methodUrl,data}
  */
  activeDeactiveUser = (formData: any): any => {
    const methodName = 'active_deactive_user';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }

}
