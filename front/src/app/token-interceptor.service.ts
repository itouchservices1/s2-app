import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from './modules/shared/service/shared.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
	constructor(private injector: Injector, private router: Router) { }
	inflightAuthRequest: any = null;
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
		const sharedService	=	this.injector.get(SharedService);
		if (req.headers.get('authExempt') === 'true') {
			return next.handle(req);
		}
		if (!this.inflightAuthRequest) {
			this.inflightAuthRequest = sharedService.getToken();
		}

		return this.inflightAuthRequest.pipe(
			switchMap((newToken: string) => {
				// unset request inflight
				this.inflightAuthRequest = null;

				// use the newly returned token
				const authReq = req.clone({
					setHeaders : {
						'api-request-referrer' : `web`,
						Authorization : `${newToken ? newToken : ''}`
					}
				});

				return next.handle(authReq);
			}),
			catchError(error => {
				// checks if a url is to an admin api or not
				if (error.status === 401) {
					// check if the response is from the token refresh end point
					const isFromRefreshTokenEndpoint = !!error.headers.get(
					'unableToRefreshToken'
					);

					if (isFromRefreshTokenEndpoint) {
						localStorage.clear();
						this.router.navigate(['/']);
						return throwError(error);
					}

					if (!this.inflightAuthRequest) {
						this.inflightAuthRequest = sharedService.refreshToken();

						if (!this.inflightAuthRequest) {
						// remove existing tokens
						localStorage.clear();
						this.router.navigate(['/']);
						return throwError(error);
						}
					}

					return this.inflightAuthRequest.pipe(
						switchMap((newToken: string) => {
							// unset inflight request
							this.inflightAuthRequest = null;

							// clone the original request
							const authReqRepeat = req.clone({
								setHeaders : {
									'api-request-referrer' : `web`,
									Authorization : `${newToken ? newToken : ''}`
								}
							});

							// resend the request
							return next.handle(authReqRepeat);
						})
					);
				} else {
					return throwError(error);
				}
			})
		);
	}
}
