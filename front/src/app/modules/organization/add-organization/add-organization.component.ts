import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeoService, NgxToasterService, UserService, CommonFunctionsService, ValidationService } from '../../../_services';
import { ERROR_MESSAGES } from '../../../global-error';
import { TextSetting } from '../../../textsetting';
import { OrganizationService } from '../service/organization.service';



@Component({
    selector: 'app-add-organization',
    standalone: false,
    providers :[SeoService],
    templateUrl: './add-organization.component.html',
    styleUrl: './add-organization.component.css'
})
export class AddOrganizationComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    env = environment;
    TextSetting = TextSetting;
    errorMessage = ERROR_MESSAGES;
    addOrganizationForm!: FormGroup;
    addOrganizationFormError: any = {};
    progress = false;
    passwordIsValid: any = false;
    organizationData: any | undefined;

    constructor(
        private formBuilder: FormBuilder,
        public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        private router: Router,
        public seoService : SeoService,
        public organizationService: OrganizationService
    ) { }

    ngOnInit(): void {


        /**this function is used to set meta title for user login  */
		this.seoService.generateTags({
			title: this.TextSetting.ADD_ORGANIZATION_TITLE,
		});
	

         this.getParentOrganizationListData();
        this.createaddOrganizationForm();
    }

    createaddOrganizationForm(): void {
        this.addOrganizationForm = this.formBuilder.group({
            organization_name   : ['', Validators.required],
            parent_organization : [null],
            email               : ['', [Validators.required, ValidationService.emailValidator]],
            phone               :  ['',Validators.required],
            country             : ['', Validators.required],
            state               : ['', Validators.required],
            city                : ['', Validators.required],
            street              : ['', Validators.required],
            zip_code            : ['',Validators.required]
      
        });
    }

      

    /** 
     * @desc Function used to get master value for business industry data
     * @method getMastervalue
     * @param none
     * @return {none}
     */
    public getParentOrganizationListData(): void {

        this.organizationService.getParentOrganizationListData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
       
            if (response.status === this.env.SUCCESS_STATUS) {
                this.organizationData = response.result;


            }
        });
    }


    /** 
    * @desc  Function used to submit add organization form
    * @method onAddOrganizationSubmit
    * @param none
    * @return {none}
    */
    public onAddOrganizationSubmit(): void {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                if (this.addOrganizationForm.valid) {
                    this.addOrganizationFormError = {};
                    const formModel: any = this.addOrganizationForm.value

                    this.organizationService.addOrganization(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS) {
                            this.progress = false;
                            this.addOrganizationForm.reset();
                            this.toastrNotification.showSuccess(response.message);
                            this.router.navigate(['/organization/organizations-list'])
                        } else {
                            this.progress = false;
                            if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                                this.addOrganizationFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.addOrganizationForm);
                }
            }
        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();

    }

}
