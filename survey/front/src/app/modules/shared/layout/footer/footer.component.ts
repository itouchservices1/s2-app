import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CommonFunctionsService } from '../../../../_services';

@Component({
  selector: 'app-footer',
   standalone:false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  /**For used to prevent memory leaks */
 private ngUnsubscribe: Subject <void> = new Subject <void> ();

 env = environment
isBrowser : boolean = false;
currentYear: number = new Date().getFullYear();
// TODO: Replace this placeholder URL with your actual Google Doc embed URL
// To embed a Google Doc: Open the doc -> File -> Share -> Publish to web -> Embed -> Copy the src URL
helpDocUrl: string = 'https://docs.google.com/document/d/e/YOUR_DOCUMENT_ID/pub?embedded=true';

 constructor(public router:Router,private commonFunctionService : CommonFunctionsService) {

 }
    ngOnInit() {

          this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
            if (isBrowser) {
           
                this.isBrowser = true;
            }
        })
      }


     
    /**Function used to destroy component data */
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }

}
