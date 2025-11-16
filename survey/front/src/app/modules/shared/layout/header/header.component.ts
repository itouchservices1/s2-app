import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonFunctionsService, UserService } from '../../../../_services';
import { environment } from '../../../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentHeader: 'admin' | 'general' | 'organization' | 'home' | 'isas-ng' | null = null;

  isBrowser: boolean = false;
  env = environment;
  userData: any = {};

  constructor(public userService: UserService, private commonFunctionService: CommonFunctionsService, public router: Router, private renderer: Renderer2) {

  }
  ngOnInit() {
    this.commonFunctionService.isBrowser.subscribe((isBrowser: any) => {
		if (isBrowser) {
			this.isBrowser = true;
			this.userData = this.userService.getCurrentUser();        
		}
    });
  }


}
