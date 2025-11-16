import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SurveyDashboardComponent } from './survey-dashboard.component';
import { AuthGuard } from "../../guards";

const routes: Routes = [
  {
       path: "",
    component: SurveyDashboardComponent,
    canActivate	:[AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyDashboardRoutingModule {}
