import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonFunctionsService } from '../../../../_services';
import { environment } from '../../../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
   standalone:false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
 currentHeader: 'admin' | 'general' | 'organization' | 'home' | 'isas-ng' | null = null;
  
isBrowser : boolean = false;
env  = environment

  constructor( private commonFunctionService: CommonFunctionsService,public router:Router,private renderer :Renderer2) {
  
  }
 ngOnInit() {
  this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
    if (isBrowser) {
      this.isBrowser = true;
          //  this.renderer.addClass(document.body, 'sb-sidenav-toggled');

   
    }
  });
}


}
