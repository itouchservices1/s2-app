import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OrganizationService } from '../service/organization.service';
import { environment } from '../../../../environments/environment';
import { SeoService, NgxToasterService, CommonFunctionsService, ValidationService } from '../../../_services';
import { ERROR_MESSAGES } from '../../../global-error';
import { TextSetting } from '../../../textsetting';




@Component({
    selector: 'app-edit-organization',
    standalone: false,
    providers :[SeoService],
    templateUrl: './edit-organization.component.html',
    styleUrl: './edit-organization.component.css'
})
export class EditOrganizationComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    env                                 = environment;
    TextSetting                         = TextSetting;
    errorMessage                        = ERROR_MESSAGES;
    editOrganizationForm!       : FormGroup;
    editOrganizationFormError   : any = {};
    progress                       = false;
    passwordIsValid             : any  = false;
    organizationData            : any | undefined;
    editOrgSlug                 : any  = "";
    editorganizationData        : any  = '';

    constructor(
        private formBuilder: FormBuilder,
        public toastrNotification: NgxToasterService,
        public route: ActivatedRoute,
        private commonFunctionService: CommonFunctionsService,
        private router: Router,
        public seoService : SeoService,
        public organizationService: OrganizationService
    ) { }

    ngOnInit(): void {


        /**this function is used to set meta title for user login  */
		this.seoService.generateTags({
			title: this.TextSetting.EDIT_ORGANIZATION_TITLE,
		});
      
        this.route.params.subscribe((params:any) => {
            if (params['edit_org_slug'] != '' && params['edit_org_slug'] != undefined) {
                this.editOrgSlug = params['edit_org_slug'];
                this.getEditParentOrganizationList();
                this.createeditOrganizationForm('');
                /**Calling function to get lead capture details */
                this.getOrganizationDetails();
            }
        });

        
     
    }

    createeditOrganizationForm(editData:any): void {
        let organization_name  : any = (editData && editData.organization_name && editData.organization_name!=='') ? editData.organization_name : '';
        let parent_organization : any = (editData && editData.parent_organization && editData.parent_organization!=='') ? editData.parent_organization : null;
        let email              : any = (editData && editData.email && editData.email!=='') ? editData.email : '';
        let country             : any = (editData && editData.country && editData.country!=='') ? editData.country : '';
        let city                : any = (editData && editData.city && editData.city!=='') ? editData.city : '';
        let state               : any = (editData && editData.state && editData.state!=='') ? editData.state : '';
        let street              : any = (editData && editData.street && editData.street!=='') ? editData.street : '';
        let phone               : any = (editData && editData.phone && editData.phone!=='') ? editData.phone : '';
        let zip_code            : any = (editData && editData.zip_code && editData.zip_code!=='') ? editData.zip_code : '';


        this.editOrganizationForm = this.formBuilder.group({
            organization_name   : [organization_name, Validators.required],
            parent_organization : [parent_organization],
            email               : [email, [Validators.required, ValidationService.emailValidator]],
            phone               :  [phone,[Validators.required]],
            country             : [country, Validators.required],
            state               : [state, Validators.required],
            city                : [city, Validators.required],
            street              : [street, Validators.required],
            zip_code            : [zip_code, Validators.required],
            organization_slug   : [this.editOrgSlug]
      
        });
    }

       /** 
     * @desc Function used to convert number to format 000-000-0000
     * @method  convertPhoneNumber
     * @param {none}
     * @return {none}
     */
       convertPhoneNumber() {
        let mobileNumberValue           : any = this.editOrganizationForm.value.phone;
        let getConvertedPhoneNumber     : any = this.commonFunctionService.convertPhoneNumber(mobileNumberValue);
        this.editOrganizationForm.controls['phone'].setValue(getConvertedPhoneNumber);
    }



 /** 
   * @desc Function used to get edit organization list data
   * @method getEditParentOrganizationList
   * @param none
   * @return {none}
   */
 public getEditParentOrganizationList(): void {

    let input : any = {}

    input['organization_slug'] = this.editOrgSlug
      this.organizationService.getEditParentOrganizationList(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
          if (response.status === this.env.SUCCESS_STATUS) {
              this.organizationData = response.result;


          }
      });
  }

    /** 
   * @desc Function used to get organization user details
   * @method getOrganizationDetails
   * @param none
   * @return {none}
   */
    public getOrganizationDetails(): void {

        let input : any = {}
    
        input['organization_slug'] = this.editOrgSlug
    
        this.organizationService.getOrganizationDetails(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            if (response.status === this.env.SUCCESS_STATUS) {
                this.editorganizationData = response.result;
                this.createeditOrganizationForm(this.editorganizationData);
    
            }
        });
    }

    /** 
    * @desc  Function used to submit add organization form
    * @method onAddOrganizationSubmit
    * @param none
    * @return {none}
    */
    public onEditOrganizationSubmit(): void {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                if (this.editOrganizationForm.valid) {
                    this.editOrganizationFormError = {};
                    const formModel: any = this.editOrganizationForm.value

                    this.organizationService.editOrganization(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS) {
                            this.progress = false;
                            this.editOrganizationForm.reset();
                            this.toastrNotification.showSuccess(response.message);
                            this.router.navigate(['/organization/organizations-list'])
                        } else {
                            this.progress = false;
                            if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                                this.editOrganizationFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.editOrganizationForm);
                }
            }
        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();

    }

}
