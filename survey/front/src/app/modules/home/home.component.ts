import { Component, AfterViewInit,OnInit, OnDestroy } from '@angular/core';
import { CommonFunctionsService, SeoService, UserService } from '../../_services';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { TextSetting } from '../../textsetting';


@Component({
    selector     : 'app-home',
    standalone   : false,
    providers    :  [SeoService],
    templateUrl  : './home.component.html',
    styleUrl     : './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject <void> ();

    env             = environment;
    TextSetting     = TextSetting;
    showPopup   : any  = false;
    isBrowser   : boolean = false;
    constructor(private seoService: SeoService,public userService: UserService,private commonFunctionService: CommonFunctionsService) {}

      ngOnInit() {

          this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
           
                this.isBrowser = true;
                   this.openSurveyPopup()
            }
        })

     
        /**this function is used to set meta title for isas ng title  */
        this.seoService.generateTags({
            title: this.TextSetting.HOME_PAGE_TITLE
        });

    }
 

    openSurveyPopup() {
        this.showPopup = true

    }

    closeSurveyPopup($event:any) {
        this.showPopup = false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
           
            }
        })
    }
}