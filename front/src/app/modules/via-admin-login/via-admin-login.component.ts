/** Import Angular Built-In Packages and Custom Files and Services */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject,timer} from 'rxjs';
import { TextSetting } from '../../textsetting';
import { environment } from '../../../environments/environment';
import { SeoService,NgxToasterService,CommonFunctionsService, UserService } from '../../_services/index';
import { ActivatedRoute,Router} from '@angular/router';
import { ViaAdminLoginService } from './service/via-admin-login.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-via-admin-login',
    standalone: false,
    template: `
    <ng-container *ngIf="dataloading">
      <app-loading></app-loading>
    </ng-container>
  `,
    providers: [NgxToasterService, ViaAdminLoginService, SeoService, CommonFunctionsService],
})
export class ViaAdminLoginComponent implements OnInit, OnDestroy {
    /**This is used to prevent memory leaks **/
    private ngUnsubscribe: Subject < void > = new Subject < void > ();
    /**This is used to prevent memory leaks **/
    /**Define Variables */
    env = environment;
    TextSetting = TextSetting;
    credentials: any = '';
    roleType: any = ''
    dataloading: boolean = true
    /**Define Constructor*/
    constructor(private toasterNotification: NgxToasterService, public userService: UserService, private commonFunctionsService: CommonFunctionsService, private seo: SeoService, public route: ActivatedRoute, public viaAdminLoginService: ViaAdminLoginService, private commonFunctionService: CommonFunctionsService, public router: Router) {}
    /** Declare Component Initialization */
    ngOnInit(): void {
        /** For used to set meta title of admin login title **/
        this.seo.generateTags({
            title: this.TextSetting.VIA_ADMIN_LOGIN
        });
        /** For used to set meta title of admin login title **/
        this.commonFunctionsService.isBrowser.subscribe((isBrowser) => {
            if (isBrowser) {
                /**For getting validate string from url params */
                this.route.params.subscribe(params => {
                    if (params['role_type'] != '' && params['role_type'] != undefined) {
                        this.roleType = params['role_type'];
                    }
                    if (params['loginCredentials'] != '' && params['loginCredentials'] != undefined) {
                        this.credentials = params['loginCredentials'];
                        /** Calling function function is used to get login credentials by user admin listing panel */
                        this.loginBySuperAdmin();
                        /** Calling function function is used to get login credentials by admin listing panel */
                    }
                });
            }
        })
    }
    /** 
     * @desc For used to login user by superadmin
     * @method loginBySuperAdmin
     * @param {none}
     * @return {none}
     */
    public loginBySuperAdmin(): void {

        let input               : any = {};
        input['user_crediantials']    = this.credentials;

        this.viaAdminLoginService.loginBySuperAdmin(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            if (response.status === this.env.SUCCESS_STATUS) {
                /** IF USER ROLE IS STANDARD SET LOCAL STORAGE LOGIN DATA FOR ORGANIZATION USER */
              
                    const user = this.userService.getCurrentUser();
                    if (user && Object.keys(user).length > 0) {
                        this.userService.purgeAuth();
                    }
                    timer(1000).subscribe(() => {
                        let loginadminData = response.result;
                        let loginAdminToken = response.token;
                        let loginAdminRefreshToken = response.refresh_token;
                        this.userService.setAuth(loginadminData);
                        this.userService.setToken(loginAdminToken);
                        this.userService.setRefreshToken(loginAdminRefreshToken);
                        this.toasterNotification.showSuccess(response.message);
                        this.dataloading = false;
                        this.router.navigate(['/home']);
                    })
                
            } else {
                this.toasterNotification.showError(response.message);
            }
        });
    }
    /** Function used to destroy component data */
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}