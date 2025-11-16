import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TextSetting } from '../../../textsetting';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonFunctionsService, NgxToasterService, SeoService, ValidationService } from '../../../_services';
import { UsersService } from '../service/users.service';


@Component({
    selector: 'app-add-users',
    standalone: false,
    providers: [UsersService, SeoService],
    templateUrl: './add-users.component.html',
    styleUrl: './add-users.component.css'
})
export class AddUsersComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    env = environment;
    TextSetting = TextSetting;

    addUserForm!: FormGroup;
    addUserFormError: any = {};
    progress = false;
    passwordIsValid: any = false;
    organizationData: any | undefined;
    usersRoleData: any | undefined;

    constructor(
        private formBuilder: FormBuilder,
        public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        private router: Router,
        public seoService: SeoService,
        public dashboardService: UsersService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: this.TextSetting.ADD_USERS_TITLE,
        });
        this.getUsersRole();
        this.getOrganizationList();
        this.createAddUserForm();
    }

    createAddUserForm(): void {
        this.addUserForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, ValidationService.emailValidator]],
            password: ['', [Validators.required, ValidationService.passwordValidator]],
            username: ['', Validators.required],
            phone: ['', Validators.required],
            role: ['', Validators.required],
            organization_ids: ['', Validators.required],
            // organization_ids: [null]
        });
        // Watch for changes to the role field
        // this.addUserForm.get('role')?.valueChanges.subscribe(role => {
        //     if (role === 'standard') {
        //         this.addUserForm.get('organization_ids')?.setValidators([Validators.required]);
        //     } else {
        //         this.addUserForm.get('organization_ids')?.clearValidators();
        //     }
        //     this.addUserForm.get('organization_ids')?.updateValueAndValidity();
        // });

        this.addUserForm.get('email')?.valueChanges.subscribe((email: string) => {
            const emailPattern = /^[^@]+@[^@]+\.[a-z]{2,}$/i;

            if (!email) {
                this.addUserForm.get('username')?.setValue('', { emitEvent: false });
            } else if (emailPattern.test(email)) {
                const username = email.split('@')[0];
                this.addUserForm.get('username')?.setValue(username, { emitEvent: false });
            } else {
                this.addUserForm.get('username')?.setValue('', { emitEvent: false });
            }
        });
    }

    onEmailBlur() {
        const email = this.addUserForm.get('email')?.value;
        const emailPattern = /^[^@]+@[^@]+\.[a-z]{2,}$/i;

        if (!email) {
            this.addUserForm.get('username')?.setValue('', { emitEvent: false });
        } else if (emailPattern.test(email)) {
            const username = email.split('@')[0];
            this.addUserForm.get('username')?.setValue(username, { emitEvent: false });
        } else {
            this.addUserForm.get('username')?.setValue('', { emitEvent: false });
        }
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
     * @desc Function used to get master value for business industry data
     * @method getMastervalue
     * @param none
     * @return {none}
     */
    public getOrganizationList(): void {

        this.dashboardService.getOrganizationList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {

            if (response.status === this.env.SUCCESS_STATUS) {
                this.organizationData = response.result;


            }
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
    * @desc  Function used to submit add user form
    * @method onAddUserSubmit
    * @param none
    * @return {none}
    */
    public onAddUserSubmit(): void {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                if (this.addUserForm.valid) {
                    this.addUserFormError = {};
                    const formModel: any = this.addUserForm.value

                    this.dashboardService.addDepartment(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS) {
                            this.progress = false;
                            this.addUserForm.reset();
                            this.toastrNotification.showSuccess(response.message);
                            this.router.navigate(['/users/users-list'])
                        } else {
                            this.progress = false;
                            if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                                this.addUserFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.addUserForm);
                }
            }
        });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }

}
