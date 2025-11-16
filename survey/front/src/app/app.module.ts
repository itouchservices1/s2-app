import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { CommonFunctionsService, EncrDecrService,UserService } from './_services/index';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptorService } from './token-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi,HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { SharedService } from './modules/shared/service/shared.service';
import { AuthGuard} from './guards/index';




@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    ToastrModule.forRoot({
			closeButton: true,
			enableHtml: true
		}),
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    CommonFunctionsService,
    SharedService,
    UserService,
     EncrDecrService,
     AuthGuard, 
  
    
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
      },
     

     
     
      provideHttpClient(
        withInterceptorsFromDi(),
        withFetch() //Add this
      ),
    provideClientHydration(withEventReplay())

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
