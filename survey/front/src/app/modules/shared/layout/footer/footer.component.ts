import { Component, OnDestroy } from '@angular/core';
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
export class FooterComponent implements OnDestroy {
  /**For used to prevent memory leaks */
 private ngUnsubscribe: Subject <void> = new Subject <void> ();

 env = environment
isBrowser : boolean = false;
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
