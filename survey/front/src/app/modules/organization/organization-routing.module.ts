import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrganizationListsComponent } from "./organization-list/organization-list.component";
import { EditOrganizationComponent } from "./edit-organization/edit-organization.component";
import { AddOrganizationComponent } from "./add-organization/add-organization.component";


const routes: Routes = [
  {
    path: "organizations-list",
    component: OrganizationListsComponent,
  },
    {
    path: "edit-organization/:edit_org_slug",
    component: EditOrganizationComponent,
  },
    {
    path: "add-organization",
    component: AddOrganizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
