import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent,SurveyPopupComponent, WorldMapComponent, HeaderComponent,PasswordStrengthComponent,LoadingComponent, NoRecordFoundComponent} from './layout/index';
import { RouterLink } from '@angular/router';
import { ControlMessagesComponent } from '../../control-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutDirective,ShowHidePasswordDirective} from '../../directive/index';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import {SafeHtmlPipe,SafeUrlPipe} from '../../_pipes/index';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [HeaderComponent,WorldMapComponent, SurveyPopupComponent,LogoutDirective,SafeHtmlPipe,SafeUrlPipe,PasswordStrengthComponent,NoRecordFoundComponent,FooterComponent,ControlMessagesComponent,LoadingComponent,ShowHidePasswordDirective],
  imports: [
    CommonModule,
    RouterLink,
    NgSelectModule,
    ReactiveFormsModule,
    NgxPaginationModule,
     SweetAlert2Module.forRoot(),
    FormsModule
  ],
  exports:[
    ReactiveFormsModule,
		FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    SafeHtmlPipe,
    SafeUrlPipe,
    ControlMessagesComponent,
    SurveyPopupComponent,
    WorldMapComponent,
    SweetAlert2Module,
    PasswordStrengthComponent,
    NoRecordFoundComponent,
    LoadingComponent,
    LogoutDirective,
    ShowHidePasswordDirective,
    HeaderComponent,
    FooterComponent,

 

  ]
})
export class SharedModule { }
