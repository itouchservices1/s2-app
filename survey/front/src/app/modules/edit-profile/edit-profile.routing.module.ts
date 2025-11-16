import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditProfileComponent } from './edit-profile.component';
import { AuthGuard } from "../../guards";

const routes: Routes = [
  {
    path: "",
    component: EditProfileComponent,
    canActivate	:[AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfileRoutingModule {}
