import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Error404Component } from './modules/error-404/error-404.component';



const routes: Routes = [
  {
		path: 'home',
	
		loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
	},
	  {
		path: '',
	
	loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
	},
	  {
		path: 'organization',
	
	loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule),
	},

	  
	 {
		path: 'edit-profile',
	
	loadChildren: () => import('./modules/edit-profile/edit-profile.module').then(m => m.EditProfileModule),
	},
	 {
		path: 'change-password',
	
	loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule),
	},

	{
	    path: "dashboard/:dashboard_type/:dashboard_id",
		loadChildren: () => import('./modules/survey-dashboard/survey-dashboard.module').then(m => m.SurveyDashboardModule)
	},


    {
		path: 'login',
		loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
	},

	{
		path: 'via-admin-login',
		loadChildren: () => import('./modules/via-admin-login/via-admin-login.module').then(m => m.ViaAdminLoginModule)
	},

	
	
	

  {path: '**', component: Error404Component}
];


@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			initialNavigation: 'enabledBlocking',
			scrollPositionRestoration: 'enabled',
			anchorScrolling: 'enabled',
			


		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
