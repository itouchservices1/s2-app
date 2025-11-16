import { Component } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil,timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TextSetting } from '../../textsetting';
import { ERROR_MESSAGES } from '../../global-error';
import { CommonFunctionsService, NgxToasterService, SeoService, UserService, ValidationService } from '../../_services';




@Component({
    selector: 'app-change-password',
    standalone: false,
    providers: [SeoService],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
    private ngUnsubscribe: Subject < void > = new Subject < void > ();
    env = environment;
    TextSetting = TextSetting;
    errorMessage = ERROR_MESSAGES;
    changePasswordForm!: FormGroup;
    changePasswordFormError: any = {};
    progress = false;
    constructor(
        private formBuilder: FormBuilder,
        public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        public userService : UserService,
        public route: ActivatedRoute,
        private router: Router,
        public seoService: SeoService,
     
    ) {}


    ngOnInit(): void {
        this.seoService.generateTags({
            title: this.TextSetting.CHANGE_PASSWORD_TITLE
        });
     
        this.createchangePasswordForm();
    }



    createchangePasswordForm(): void {
       
        this.changePasswordForm = this.formBuilder.group({
            old_password          : ["", Validators.required],
            new_password          : ["", [Validators.required,ValidationService.passwordValidator]],
           confirm_password       : ["",[Validators.required,ValidationService.RequiredConfirmMatchPassword]]

        });
                this.changePasswordForm.get('new_password')?.valueChanges.subscribe(() => {
            this.changePasswordForm.get('confirm_password')?.updateValueAndValidity();
        });
    }


    /** 
     * @desc  Function used to change password of admin
     * @method changePassword
     * @param none
     * @return {none}
     */
    public changePassword(): void {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                if (this.changePasswordForm.valid) {
                    this.changePasswordFormError = {};
                    const formModel: any = this.changePasswordForm.value
                 
                    this.commonFunctionService.changePassword(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS) {
                            this.progress = false;
                                 this.userService.updateCurrentUserData();
                                this.toastrNotification.showSuccess(response.message);
                                this.changePasswordForm.reset();
                                
                     
                        } else {
                            this.progress = false;
                            if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                                this.changePasswordFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.changePasswordForm);
                }
            }
        });
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}

