import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from "./users-routing.module";
import { SharedModule } from '../shared/shared.module';
import { AddUsersComponent, EditUsersComponent, UsersListsComponent } from './index';


@NgModule({
  declarations: [UsersListsComponent,EditUsersComponent,AddUsersComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
