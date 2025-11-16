import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViaAdminLoginComponent } from "./via-admin-login.component";


const routes: Routes = [
  {
    path: ":role_type/:loginCredentials",
    component: ViaAdminLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViaAdminLoginRoutingModule {}
