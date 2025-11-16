import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService, NgxToasterService } from '../../../../../_services';

@Component({
    selector: 'app-survey-popup',
    standalone: false,
    templateUrl: './survey-sight-popup.component.html',
    styleUrls: ['./survey-sight-popup.component.css']
})
export class SurveyPopupComponent implements OnInit, OnDestroy {
    @Output() CloseModalBooleanValue = new EventEmitter < boolean > ();
    /**For used to prevent memory leaks */
    private ngUnsubscribe: Subject < void > = new Subject < void > ();
    showPopup = true; // toggle this from parent component if needed
    selectedSurvey: any;
    env = environment
    dataloading: boolean = true;
    metaData: any | undefined;
    supersetData: any | undefined;
    selectedMetaId: number | null = null;
    selectedSuperId: number | null = null;
    publishedSuperSetDashboards: any[] = [];
    dashboardType: any = "";
    supersetMetabaseMergedData: any = [];
    selectedId: number | null = null;
    selectedType : any = '';
    mergedData: any[] = []; // Should contain { id, name, type }
    metabaseResponseFlag: boolean = false;
    supersetResponseFlag: boolean = false;
    constructor(public router: Router, public route: ActivatedRoute,public toastrNotification : NgxToasterService, private commonFunctionService: CommonFunctionsService) {}
    ngOnInit(): void {
        this.getMetaBaseDashboard();
        this.getSuperSetDashboardList();
    }
    closePopup() {
        /**sending value to parent component through output emitter */
        this.CloseModalBooleanValue.emit(false);
    }
    submitSurvey() {
       

        if(this.selectedId!==null) {
           if (this.selectedType === 'metabase') {
            this.navigateToMeta(this.selectedId);
        } else if (this.selectedType === 'superset') {
            this.navigateToSuper(this.selectedId);
        }
        }else{
                this.toastrNotification.showError("Please select to proceed further");
        }
       
    }
    /** 
     * @desc Function used to fetch metabase details
     * @method navigateToMeta
     * @param {id}
     * @return {none}
     */
    navigateToMeta(id: number | null): void {
        if (id) {
            this.selectedMetaId = id;
            this.selectedSuperId = null;
            this.router.navigate([`/dashboard/${this.env.METABASE_ROUTE}/${id}`]);
        }
    }
    /** 
     * @desc Function used to fetch super set details
     * @method navigateToSuper
     * @param {id}
     * @return {none}
     */
    navigateToSuper(id: number | null): void {
        if (id) {
            this.selectedSuperId = id;
            this.selectedMetaId = null;
            this.router.navigate([`/dashboard/${this.env.SUPERSET_ROUTE}/${id}`]);
        }
    }
    /** 
     * @desc Function used to get meta dashboard details
     * @method getMetaDashboardDetails
     * @param none
     * @return {none}
     */
    public getMetaBaseDashboard(): void {
        this.dataloading = true
        this.commonFunctionService.getMetaBaseDashboard().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            if (response.status === this.env.SUCCESS_STATUS) {
                this.metaData = response.result;
                this.metaData.map((records: any) => {
                    this.supersetMetabaseMergedData.push({
                        'type': "metabase",
                        'id': records.id,
                        'name': records.name,
                        'category': records.collection_name
                    })
                })
                // this.dataloading = false
            } else {
                // this.dataloading = false
            }
            this.metabaseResponseFlag = true;
            this.loadingOff();
        });
    }
    /** 
     * @desc Function used to get  super set  dashboard details
     * @method getSuperSetDashboardList
     * @param none
     * @return {none}
     */
    public getSuperSetDashboardList(): void {
        this.dataloading = true;
        this.commonFunctionService.getSuperSetDashboardList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      
            if (response.status === this.env.SUCCESS_STATUS) {
                this.supersetData = response.result;
                //  Filter for 'published' dashboards
                this.publishedSuperSetDashboards = this.supersetData.filter(
                    (s: any) => s.status?.toLowerCase() === 'published'
                );
                this.publishedSuperSetDashboards.map((recordsSuperset: any) => {
                    this.supersetMetabaseMergedData.push({
                        'type': "superset",
                        'id': recordsSuperset.id,
                        'name': recordsSuperset.dashboard_title,
                        'category': "Survey"
                    })
                });
                // this.dataloading = false;
            } else {
                // this.dataloading = false;
            }
            this.supersetResponseFlag = true;
            this.loadingOff();
        });
    }
    /** Loading close after result  */
    loadingOff() {
        if (this.supersetResponseFlag && this.metabaseResponseFlag) {
            this.dataloading = false;
        }
    }
    /** onchange after selcted data */
    onSelectionChange(eventData: any) {
        this.selectedId = eventData.id;
        this.selectedType = eventData.type;
       
    }
    /**Function used to destroy component data */
    ngOnDestroy(): void {
        this.closePopup();
        this.ngUnsubscribe.next();        
    }
}