import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from "./organization-routing.module";
import { SharedModule } from '../shared/shared.module';
import { AddOrganizationComponent, EditOrganizationComponent, OrganizationListsComponent } from './index';


@NgModule({
  declarations: [OrganizationListsComponent,EditOrganizationComponent,AddOrganizationComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrganizationRoutingModule,
  ]
})
export class OrganizationModule { }
