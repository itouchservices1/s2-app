import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService, NgxToasterService } from '../_services';
import { environment } from '../../environments/environment';
import { timer } from 'rxjs';

@Injectable()
export class AdminAccessGuard implements CanActivate {

  env = environment;

  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: NgxToasterService
  ) {}

  canActivate(): boolean {

    const userData = this.userService.getCurrentUser();

    /** 🛑 Only Role Check (AuthGuard already verifies login) */
    if (userData && userData.user_type !== this.env.ROLE_STANDARD) {
      return true; // Admin allowed
    }

    /** ❌ Standard User → Block */
    timer(200).subscribe(() => {
      this.toaster.showError("Access Denied");
    });

    this.router.navigate(['/']); // Redirect to home or error page
    return false;
  }
}

