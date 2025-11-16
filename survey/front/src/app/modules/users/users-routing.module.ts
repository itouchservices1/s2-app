import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersListsComponent } from "./users-lists/users-lists.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AddUsersComponent } from "./add-users/add-users.component";


const routes: Routes = [
  {
    path: "users-list",
    component: UsersListsComponent,
  },
    {
    path: "edit-user/:edit_slug",
    component: EditUsersComponent,
  },
    {
    path: "add-user",
    component: AddUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
