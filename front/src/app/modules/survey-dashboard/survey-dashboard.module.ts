import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyDashboardComponent } from './survey-dashboard.component';
import { SurveyDashboardRoutingModule } from "./survey-dashboard-routing.module";
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SurveyDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    SurveyDashboardRoutingModule,
  ]
})
export class SurveyDashboardModule { }
