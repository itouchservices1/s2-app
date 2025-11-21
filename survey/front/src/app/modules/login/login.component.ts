import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonFunctionsService, NgxToasterService, SeoService, UserService, ValidationService } from '../../_services';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil, timer } from 'rxjs';
import { TextSetting } from '../../textsetting';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR_MESSAGES } from '../../global-error';

@Component({
    selector: 'app-login',
    standalone: false,
    providers: [LoginService, SeoService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    /**For used to prevent memory leaks */
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    /**Declare Variables */
    env = environment;
    TextSetting = TextSetting;
    errorMessage = ERROR_MESSAGES
    progress: boolean = false;
    rememberMeValue: boolean = false;
    loginForm: FormGroup;
    loginFormError: any = {};
    remeberMeData: any = {};
    dataloading: any = true;
    /** Define Constructor */
    constructor(
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        public toastrNotification: NgxToasterService,
        public userService: UserService,
        private commonFunctionService: CommonFunctionsService,
        public route: ActivatedRoute,
        public seoService: SeoService,
    ) {
        /** For used to initialize form froup */
        this.loginForm = this.formBuilder.group({});
    }
    /** For used to initialize Component */
    ngOnInit(): void {

        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                const user = this.userService.getCurrentUser();
                if (user && Object.keys(user).length > 0) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.dataloading = false; // show form only if not logged in
                }
            }
        })



        /**this function is used to set meta title for user login  */
        this.seoService.generateTags({
            title: this.TextSetting.LOGIN_PAGE_TITLE,
        });
        // Call toastr notification in ngOnInit
        /**Calling function to create login form  */
        this.createLoginForm();
    }
    /**
     * @desc  Function used to create login form
     * @method createLoginForm
     * @param none
     * @return {none}
     */
    public createLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ["", Validators.required]

        });
    }
    /**
     * @desc  Function used to submit login form
     * @method onAdminLoginSubmit
     * @param none
     * @return {none}
     */
    public onAdminLoginSubmit() {
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
                this.progress = true;
                const req = {
                    email: this.loginForm.value.email,
                    password: this.loginForm.value.password,
                };
                if (this.loginForm.valid) {
                    this.loginService.LoginUser(req).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                        if (response.status == this.env.SUCCESS_STATUS || (response.status == this.env.OTP_STATUS_ERROR_VALIDATION && response.skip_without_flag == true)) {
                            let loginData = response.result;
                            let loginToken = response.token;
                            let loginRefreshToken = response.refresh_token;
                            this.userService.setAuth(loginData);
                            this.userService.setToken(loginToken);
                            this.userService.setRefreshToken(loginRefreshToken);
                            this.toastrNotification.showSuccess(response.message);
                            timer(1000).subscribe(() => {
                                this.progress = false;
                                this.router.navigate(['/home']);
                            });
                        } else {
                            if (response.errors != undefined && response.errors != "" && response.errors != null) {
                                this.loginFormError = response.errors;
                            } else {
                                this.toastrNotification.showError(response.message);
                            }
                            this.progress = false;
                        }
                    });
                } else {
                    this.progress = false;
                    ValidationService.validateAllFormFields(this.loginForm);
                }
            }
        });
    }
    /**Function used to destroy component data */
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}