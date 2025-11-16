import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../shared/service/shared.service';


@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

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
 * @desc For used to add organization
 * @method addOrganization
 * @param formData
 * @return {methodUrl,data}
 */
  addOrganization = (formData: any): any => {
    const methodName = 'add_organization';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData;
    return this.sharedService.getPost(methodUrl, this.data);
  }

  /** 
 * @desc For used to eidt organization
 * @method editOrganization
 * @param formData
 * @return {methodUrl,data}
 */
  editOrganization = (formData: any): any => {
    const methodName = 'update_organization';
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
 * @desc For used to get dashboard details
 * @method getDashboardDetails
 * @param formData
 * @return {methodUrl,data}
 */
    getDashboardDetails = (): any => {
      const methodName = 'super_admin_dashboard';
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
    getEditOrganizationList = (formData:any): any => {
      const methodName = 'get_organization';
      const methodUrl = environment.API_URL + methodName;
      this.data['data'] = formData;
      return this.sharedService.getPost(methodUrl, this.data);
    }
  



  /** 
 * @desc For used to get organization list
 * @method getOrganizationListData
 * @param formData
 * @return {methodUrl,data}
 */
  getOrganizationListData = (formData:any): any => {
      const methodName = 'get_organization_list';
      const methodUrl = environment.API_URL + methodName;
      this.data['data'] = formData
      return this.sharedService.getPost(methodUrl, this.data);
    }


   

    /** 
 * @desc For used to get  edit parent organization list
 * @method getEditParentOrganizationList
 * @param formData
 * @return {methodUrl,data}
 */
    getEditParentOrganizationList = (formData:any): any => {
    const methodName = 'get_parent_organization';
    const methodUrl = environment.API_URL + methodName;
    this.data['data'] = formData
    return this.sharedService.getPost(methodUrl, this.data);
  }

     /** 
 * @desc For used to get  edit parent organization list
 * @method getOrganizationDetails
 * @param formData
 * @return {methodUrl,data}
 */
     getOrganizationDetails = (formData:any): any => {
      const methodName = 'organization_details';
      const methodUrl = environment.API_URL + methodName;
      this.data['data'] = formData
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
 * @desc For used to get parent organization list
 * @method getParentOrganizationListData
 * @param formData
 * @return {methodUrl,data}
 */
  getParentOrganizationListData = (): any => {
    const methodName = 'get_parent_organization';
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
    getDepartmentUserDetails = (formData:any): any => {
      const methodName = 'get_department_user_detals';
      const methodUrl = environment.API_URL + methodName;
      this.data['data'] = formData
      return this.sharedService.getPost(methodUrl, this.data);
    }
  


}
