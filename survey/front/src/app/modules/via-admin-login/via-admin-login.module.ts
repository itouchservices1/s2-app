


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViaAdminLoginRoutingModule } from './via-admin-login-routing.module';

import { ViaAdminLoginComponent } from './via-admin-login.component';
import { SharedModule } from '../shared/shared.module';





@NgModule({
  declarations: [ViaAdminLoginComponent],

  imports: [
    CommonModule,
    SharedModule,
    ViaAdminLoginRoutingModule
  ]
})
export class ViaAdminLoginModule { }

