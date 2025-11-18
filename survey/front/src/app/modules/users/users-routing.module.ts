import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersListsComponent } from "./users-lists/users-lists.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AddUsersComponent } from "./add-users/add-users.component";
import { AuthGuard, AdminAccessGuard } from "../../guards";
import { Error404Component } from "../error-404/error-404.component";


const routes: Routes = [
  {
    path: "users-list",
    component: UsersListsComponent,
    canActivate:[AuthGuard,AdminAccessGuard]
  },
    {
    path: "edit-user/:edit_slug",
    component: EditUsersComponent,
    canActivate:[AuthGuard,AdminAccessGuard]
  },
    {
    path: "add-user",
    component: AddUsersComponent,
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
export class UsersRoutingModule {}
