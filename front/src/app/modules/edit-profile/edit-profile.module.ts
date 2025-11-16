import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { EditProfileRoutingModule } from "./edit-profile.routing.module";
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    EditProfileRoutingModule,
  ]
})
export class EditProfileModule { }
