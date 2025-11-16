import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { UsersService } from '../service/users.service';
import { environment } from '../../../../environments/environment';
import { SeoService, NgxToasterService, CommonFunctionsService } from '../../../_services';
import { TextSetting } from '../../../textsetting';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-users-lists',
    standalone: false,
    templateUrl: './users-lists.component.html',
    providers: [UsersService, SeoService],
    styleUrl: './users-lists.component.css'
})
export class UsersListsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject < void > = new Subject < void > ();
    env = environment;
    dataloading: boolean = false;
    TextSetting = TextSetting
    total_record: any = "";
    page: number = 1;
    recordLimit: any = "";
    departmentLists: any | undefined;
    usersRoleData: any | undefined;
    organizationData: any | undefined;
    public searchFilters: any = {
        search_full_name: "",
        search_email: "",
        search_username: "",
        search_organization_id: null,
        search_role: null,
        search_active: null
    };
    roles = [{
            value: '',
            label: 'Select Role'
        },
        {
            value: 'Admin',
            label: 'Admin'
        },
        {
            value: 'Standard',
            label: 'Standard'
        },
        {
            value: 'General',
            label: 'General'
        }
    ];
    statusData = [{
            value: '',
            label: 'Select Status'
        },
        {
            value: '1',
            label: 'Active'
        },
        {
            value: '0',
            label: 'Inactive'
        }
    ];
    constructor(public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        private router: Router,
        public seoService: SeoService,
        public dashboardService: UsersService) {}
    ngOnInit(): void {
        this.seoService.generateTags({
            title: this.TextSetting.USER_LISTING_TITLE,
        });
        this.getOrganizationList();
        this.getUsersRole();
        this.getDepartmentListData('');
    }
    /** 
     * @desc For used to get  department list data
     * @method getDepartmentListData
     * @param {none}
     * @return {none}
     */
    public getDepartmentListData(type:any): void {
        this.dataloading = true;
        let input: any = {
            page: this.page,
            ...this.searchFilters
        };
        this.dashboardService.getDepartmentListData(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            if (response.status === this.env.SUCCESS_STATUS) {
                this.departmentLists = response.result;
                /** for getting default sub user data in checklist array */
                this.recordLimit = response.limit;
                this.total_record = response.total_records
                this.dataloading = false;
                
                /** if single record is visible on any page then redirect this to page number 1 */
                if (this.departmentLists.length == 0) {
                    this.page = 1
                }
                     if(type=='search') {
                  this.scrollToBottom();
                
                  
                }
            }
        });
    }

    scrollToBottom(): void {
  timer(10).subscribe(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth' // optional: smooth scroll
    });
  });
}

    /** 
     * @desc For used to get  reset filters
     * @method resetFilters
     * @param {none}
     * @return {none}
     */
    public resetFilters(): void {
        this.searchFilters = {
            search_full_name: "",
            search_email: "",
            search_username: "",
            search_organization_id: null,
            search_role: null,
            search_active: null
        };
        this.getDepartmentListData(''); // reset ke baad fresh data load
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
     * @desc For used to active deactive user
     * @method activeDeactiveUser
     * @param {user}
     * @return {none}
     */
    activeDeactiveUser(user: any) {
        Swal.fire({
            title: 'Are you sure?',
            text: user.is_active == 1 ? 'Inactivate this user?' : 'Activate this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.dataloading = true;
                let input: any = {};
                input['status'] = user.is_active;
                input['update_user_id'] = user._id
                this.dashboardService.activeDeactiveUser(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
                    if (response.status === this.env.SUCCESS_STATUS) {
                        this.toastrNotification.showSuccess(response.message);
                        this.getDepartmentListData('')
                        this.dataloading = false;
                    } else {
                        this.dataloading = false;
                    }
                });
            }
        });
    }
    /** 
     * @desc For used to login user by superadmin
     * @method loginBySuperAdmin
     * @param {none}
     * @return {none}
     */
    public loginBySuperAdmin(data: any): void {
        let stringData = btoa(data.email + '#@!' + data.slug);
        let current_role = data.role == this.env.ROLE_STANDARD ? this.env.ROLE_STANDARD : this.env.ROLE_GENERAL;
        let viaAdminURL = this.env.SITE_URL + 'via-admin-login/' + current_role + '/' + stringData;
        // Unique window name using role and timestamp
        let uniqueWindowName = 'login_' + current_role + '_' + new Date().getTime();
        window.open(viaAdminURL, uniqueWindowName);
    }
    /** 
     * @desc  function used to handle pagination
     * @method onPageChange
     * @param event
     * @return {none}
     */
    onPageChange(event: any): void {
        this.page = event;
        this.getDepartmentListData('');
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}