import { Component, OnDestroy, OnInit } from '@angular/core';


import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { OrganizationService } from '../service/organization.service';
import { environment } from '../../../../environments/environment';
import { SeoService, NgxToasterService, CommonFunctionsService } from '../../../_services';
import { TextSetting } from '../../../textsetting';


@Component({
    selector: 'app-organization-lists',
    standalone: false,
    templateUrl: './organization-list.component.html',
    providers: [SeoService],
    styleUrl: './organization-list.component.css'
})
export class OrganizationListsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject < void > = new Subject < void > ();
    env = environment;
    dataloading: boolean = false;
    TextSetting = TextSetting
    total_record: any = "";
    page: number = 1;
    recordLimit: any = "";
    organizationLists: any | undefined;
    organizationData: any | undefined;
    public searchFilters: any = {
        search_organization_name: '',
        search_email: '',
        search_phone: '',
        search_country: '',
        search_zip_code: '',
        search_state: '',
        search_city: '',
        search_street: '',
        search_parent_organization: null
    };

    constructor(public toastrNotification: NgxToasterService,
        private commonFunctionService: CommonFunctionsService,
        private router: Router,
        public seoService: SeoService,
        public organizationService: OrganizationService) {}

    ngOnInit(): void {
        this.getParentOrganizationListData();
        this.seoService.generateTags({
            title: this.TextSetting.ORGANIZATION_LISTING_TITLE,
        });
        this.getOrganizationListData('');
    }
    /** 
     * @desc Function used to get parent organization data
     * @method getParentOrganizationListData
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
     * @desc For used to get  organization list data
     * @method getOrganizationListData
     * @param {none}
     * @return {none}
     */
    public getOrganizationListData(type:any): void {
        this.dataloading = true;
        let input: any = {
            page: this.page,
            ...this.searchFilters
        };
        this.organizationService.getOrganizationListData(input).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            
            if (response.status === this.env.SUCCESS_STATUS) {
                this.organizationLists = response.result;
                /** for getting default sub user data in checklist array */
                this.recordLimit = response.limit;
                this.total_record = response.total_records
                this.dataloading = false;
                if(type=='search') {
                  this.scrollToBottom();
                
                  
                }
                /** if single record is visible on any page then redirect this to page number 1 */
                if (this.organizationLists.length == 0) {
                    this.page = 1
                }
            }
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
            search_organization_name: '',
            search_email: '',
            search_phone: '',
            search_country: '',
            search_zip_code: '',
            search_state: '',
            search_city: '',
            search_street: '',
            search_parent_organization: null
        };
        this.getOrganizationListData(''); // reset ke baad fresh data load
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
     * @desc  function used to handle pagination
     * @method onPageChange
     * @param event
     * @return {none}
     */
    onPageChange(event: any): void {
        this.page = event;
        this.getOrganizationListData('');
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}
