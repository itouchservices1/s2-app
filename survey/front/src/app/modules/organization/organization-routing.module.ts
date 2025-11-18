import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrganizationListsComponent } from "./organization-list/organization-list.component";
import { EditOrganizationComponent } from "./edit-organization/edit-organization.component";
import { AddOrganizationComponent } from "./add-organization/add-organization.component";
import { AdminAccessGuard, AuthGuard } from "../../guards";
import { Error404Component } from "../error-404/error-404.component";


const routes: Routes = [
  {
    path: "organizations-list",
    component: OrganizationListsComponent,
    canActivate:[AuthGuard,AdminAccessGuard]
  },
    {
    path: "edit-organization/:edit_org_slug",
    component: EditOrganizationComponent,
      canActivate:[AuthGuard,AdminAccessGuard]
  },
    {
    path: "add-organization",
    component: AddOrganizationComponent,
      canActivate:[AuthGuard,AdminAccessGuard]
  },
    {
    path: "**",
    component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
