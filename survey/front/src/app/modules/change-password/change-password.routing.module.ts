import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChangePasswordComponent } from './change-password.component';
import { AuthGuard } from "../../guards";

const routes: Routes = [
  {
    path: "",
    component: ChangePasswordComponent,
    canActivate	:[AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}
