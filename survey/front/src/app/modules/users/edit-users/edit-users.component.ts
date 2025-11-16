import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TextSetting } from '../../../textsetting';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonFunctionsService, NgxToasterService, SeoService, ValidationService } from '../../../_services';
import { UsersService } from '../service/users.service';


@Component({
  selector: 'app-edit-users',
  standalone: false,
    providers: [UsersService,SeoService],
  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.css'
})
export class EditUsersComponent implements OnInit, OnDestroy {
  
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  env = environment;
  TextSetting = TextSetting;

  editUserForm!: FormGroup;
  editUserFormError: any = {};
  progress = false;
  passwordIsValid: any = false;
  organizationData: any | undefined;
  editDepartmentSlug : any = '';
  editDepartmentData : any = '';
  usersRoleData      : any | undefined;
  constructor(
      private formBuilder: FormBuilder,
      public toastrNotification: NgxToasterService,
      private commonFunctionService: CommonFunctionsService,
      public route: ActivatedRoute,
      private router: Router,
        public seoService: SeoService,
      public dashboardService: UsersService
  ) { }

  ngOnInit(): void {
    this.seoService.generateTags({
        title: this.TextSetting.EDIT_USERS_TITLE,
    });

    this.route.params.subscribe((params:any) => {
      if (params['edit_slug'] != '' && params['edit_slug'] != undefined) {
          this.editDepartmentSlug = params['edit_slug'];
          /**Calling function to get lead capture details */
          this.getDepartmentUserDetails();
      }
  });
      this.getUsersRole();
      this.getEditOrganizationList();
      this.createEditUserForm('');
  }

  createEditUserForm(editData:any): void {
    let email             : any = (editData && editData.email && editData.email!=='') ? editData.email : '';
    let first_name        : any = (editData && editData.first_name && editData.first_name!=='') ? editData.first_name : '';
    let last_name         : any = (editData && editData.last_name && editData.last_name!=='') ? editData.last_name : '';
    let username          : any = (editData && editData.username && editData.username!=='') ? editData.username : '';
    let phone             : any = (editData && editData.phone && editData.phone!=='') ? editData.phone : '';
    let role              : any = (editData && editData.role && editData.role!=='') ? editData.role : '';
    let organization_ids = (editData && editData.organization_ids && editData.organization_ids!=='') ? editData.organization_ids : null;
      this.editUserForm = this.formBuilder.group({
          first_name        : [first_name, Validators.required],
          last_name         : [last_name, Validators.required],
          email             : [email, [Validators.required, ValidationService.emailValidator]],
          password            : ["", ValidationService.passwordValidator],
          confirm_password    : ["",  ValidationService.RequiredConfirmMatchPassword],
          username          : [username, Validators.required],
          phone             : [phone, Validators.required],
          role              : [role, Validators.required],
          organization_ids  : [organization_ids, Validators.required],
          update_user_slug  : [this.editDepartmentSlug]
      });

      this.editUserForm.get('password')?.valueChanges.subscribe(() => {
        this.editUserForm.get('confirm_password')?.updateValueAndValidity();
      });

      this.checkOrganizationValidationAccordingToRole();
  }

  checkOrganizationValidationAccordingToRole() {

     // Watch for changes to the role field
    //  this.editUserForm.get('role')?.valueChanges.subscribe(role => {
    //     // Ensure organization_ids is required when 'standard' role is selected
    //     if (role === 'standard') {
    //         this.editUserForm.get('organization_ids')?.setValidators([Validators.required]);
    //     } else {
    //         this.editUserForm.get('organization_ids')?.clearValidators();
    //     }
    //     this.editUserForm.get('organization_ids')?.updateValueAndValidity();
    // });

    // Handle case when organization_ids is cleared and role is still 'standard'
    this.editUserForm.get('organization_ids')?.valueChanges.subscribe(organization_ids => {
        const role = this.editUserForm.get('role')?.value;
        // if (role === 'standard' && organization_ids==null &&  organization_ids=='') {
            // Apply required validation if no organization_ids are selected
            this.editUserForm.get('organization_ids')?.setValidators([Validators.required]);
            this.editUserForm.get('organization_ids')?.updateValueAndValidity();
        // }
    });
  }



   /** 
     * @desc Function used to get user role data
     * @method getUsersRole
     * @param none
     * @return {none}
     */
   public getUsersRole(): void {
    this.dashboardService.getUsersRole().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        if (response.status === this.env.SUCCESS_STATUS) {
            this.usersRoleData = response.result;
        }
    });
}


  /** 
   * @desc  Check password strength is valid or not
   * @method passwordValid
   * @param event
   * @return {none}
   */
  passwordValid(event: any) {
      this.passwordIsValid = event;
  }

  
  /** 
   * @desc Function used to get department user details
   * @method getDepartmentUserDetails
   * @param none
   * @return {none}
   */
  public getDepartmentUserDetails(): void {
    let input : any = {}
    input['update_user_slug'] = this.editDepartmentSlug

    this.dashboardService.getDepartmentUserDetails(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        if (response.status === this.env.SUCCESS_STATUS) {
            this.editDepartmentData = response.result;
            this.createEditUserForm(this.editDepartmentData);
        }
    });
}


onRoleChange(event: any): void {
    const selectedValue = event.target.value;
  
    if(selectedValue!=='standard') {
        this.editUserForm.get('organization_ids')?.setValue(null);
    }
  }

  /** 
   * @desc Function used to get edit organization list data
   * @method getEditOrganizationList
   * @param none
   * @return {none}
   */
  public getEditOrganizationList(): void {
    let input : any = {}
    input['update_user_slug'] = this.editDepartmentSlug
    this.dashboardService.getEditOrganizationList(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        if (response.status === this.env.SUCCESS_STATUS) {
            this.organizationData = response.result;
        }
    });
  }


  /** 
  * @desc  Function used to submit add user form
  * @method updateSuperAdminDepartment
  * @param none
  * @return {none}
  */
  public updateSuperAdminDepartment(): void {
      this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
          if (isBrowser) {
              this.progress = true;
              if (this.editUserForm.valid) {
                  this.editUserFormError = {};
                  const formModel: any = this.editUserForm.value

                  this.dashboardService.updateSuperAdminDepartment(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                      if (response.status == this.env.SUCCESS_STATUS) {
                          this.progress = false;
                          this.editUserForm.reset();
                          this.toastrNotification.showSuccess(response.message);
                          this.router.navigate(['/users/users-list'])
                      } else {
                          this.progress = false;
                          if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                              this.editUserFormError = response.errors;
                          } else {
                              this.toastrNotification.showError(response.message);
                          }
                      }
                  });
              } else {
                  this.progress = false;
                  ValidationService.validateAllFormFields(this.editUserForm);
              }
          }
      });
  }


  ngOnDestroy(): void {
      this.ngUnsubscribe.next();

  }

}



