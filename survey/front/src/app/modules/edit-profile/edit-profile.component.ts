import { Component } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil,timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SeoService, NgxToasterService, CommonFunctionsService, ValidationService, UserService } from '../../_services';
import { ERROR_MESSAGES } from '../../global-error';
import { TextSetting } from '../../textsetting';




@Component({
    selector: 'app-edit-profile',
    standalone: false,
    providers: [SeoService],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
    private ngUnsubscribe: Subject <void> = new Subject < void > ();
    env = environment;
    TextSetting = TextSetting;
    errorMessage = ERROR_MESSAGES;
    editProfileForm!: FormGroup;
    editProfileFormError: any = {};
    progress = false;
    constructor(
        private formBuilder: FormBuilder,
        public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        public route: ActivatedRoute,
        public userService: UserService,
        private router: Router,
        public seoService: SeoService

    ) {}


    ngOnInit(): void {
        this.seoService.generateTags({
            title: this.TextSetting.EDIT_PROFILE,
        });
     
        this.createeditProfileForm();
    }



    createeditProfileForm(): void {
        let editData                  = this.userService.getCurrentUser();
        let email               : any = (editData && editData.email && editData.email !== '') ? editData.email : '';
        let first_name          : any = (editData && editData.first_name && editData.first_name !== '') ? editData.first_name : '';
        let last_name           : any = (editData && editData.last_name && editData.last_name !== '') ? editData.last_name : '';
        let username            : any = (editData && editData.username && editData.username !== '') ? editData.username : '';
        let phone               : any = (editData && editData.phone && editData.phone !== '') ? editData.phone : '';
        this.editProfileForm = this.formBuilder.group({
            first_name          : [first_name, Validators.required],
            last_name           : [last_name, Validators.required],
            email               : [email, [Validators.required, ValidationService.emailValidator]],
            username            : [username, Validators.required],
            phone               : [phone],
        });
    }


    /** 
     * @desc  Function used to update admin profile
     * @method updateAdminProfile
     * @param none
     * @return {none}
     */
    public updateAdminProfile(): void {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                if (this.editProfileForm.valid) {
                    this.editProfileFormError = {};
                    const formModel: any = this.editProfileForm.value
                    
                    this.commonFunctionService.updateProfile(formModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS) {
                            this.progress = false;
                          
                            if (this.editProfileForm.value.username !== this.userService.getCurrentUser().username|| (this.editProfileForm.value?.email && this.editProfileForm.value?.email.toLowerCase() !== this.userService.getCurrentUser()?.email.toLowerCase())) {
                                /** logout user if user changed its email address or username */
                                this.router.navigate(['/login']);
                                this.toastrNotification.showSuccess(this.errorMessage.CHANGE_USERNAME_LOGOUT_MESSAGE)
                                this.userService.purgeAuth();
                            } else {
                                  this.toastrNotification.showSuccess(response.message);
                                this.userService.updateCurrentUserData();
                                /**  redirect to dashbord page if user not updated their email address or username */
                                this.router.navigate(['/home']);
                            }
                        } else {
                            this.progress = false;
                            if (response.errors !== undefined && response.errors !== '' && response.errors !== null) {
                                this.editProfileFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.editProfileForm);
                }
            }
        });
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}

