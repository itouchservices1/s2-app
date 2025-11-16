var moduleApisPath = "/api/";

global.atob = require("atob");
global.btoa = require("btoa");

/** Set current view folder **/
app.use(moduleApisPath, (req, res, next) => {
	if (!req.rendering) {
		req.rendering = {}; // Initialize if undefined
	}
	req.rendering.views = WEBSITE_MODULES_PATH + "api/views";
	next();
});

/** Default validation response and default validation */
const { validateResponseReturn, loginValidationRules, editProfileValidationRules, changePasswordForLoginUserValidateRules } = require(WEBSITE_VALIDATION_FOLDER_PATH + 'default_validation.js');


/***************************************** START DEFAULT ROUTING API *****************************************/

var defaultApi = require(WEBSITE_MODULES_PATH + "api/model/default");

/** Routing is used to edit profile in super admin routes*/
app.all(moduleApisPath + "edit_profile_super_admin", middlewareReuestAllApis, editProfileValidationRules(), validateResponseReturn, function (req, res, next) {
	defaultApi.editProfile(req, res, next);
});

/** Routing is used to change password for super admin routes**/
app.all(moduleApisPath + "change_password_for_super_admin", middlewareReuestAllApis, changePasswordForLoginUserValidateRules(), validateResponseReturn, function (req, res, next) {
	defaultApi.changeUserPassword(req, res, next);
});

/** Routing is used to get user details for super admin**/
app.all(moduleApisPath + "get_user_detail", middlewareReuestAllApis, function (req, res, next) {
	defaultApi.getUserDetail(req, res, next);
});
/***************************************** END DEFAULT ROUTING API *****************************************/


/***************************************** START SUPER ADMIN ROUTING API *****************************************/

var superadminApi = require(WEBSITE_MODULES_PATH + "api/model/superadmin");
const { addUserDepartmentValidationRules, updateUserDepartmentValidationRules } = require(WEBSITE_VALIDATION_FOLDER_PATH + 'super_admin_validation.js');

/** Routing is used to login for super admin */
app.all(moduleApisPath + "super_admin_login", middlewareReuestAllApis, loginValidationRules(), validateResponseReturn, function (req, res, next) {
	superadminApi.superAdminLogin(req, res, next);
});

/** Routing is used to add user/department */
app.all(moduleApisPath + "add_super_admin_department", middlewareReuestAllApis, addUserDepartmentValidationRules(), validateResponseReturn, function (req, res, next) {
	superadminApi.addSuperAdminDepartment(req, res, next);
});

/** Routing is used to edit/update department */
app.all(moduleApisPath + "update_super_admin_department", middlewareReuestAllApis, updateUserDepartmentValidationRules(), validateResponseReturn, function (req, res, next) {
	superadminApi.updateSuperAdminDepartment(req, res, next);
});

/** Routing is used to get department user details**/
app.all(moduleApisPath + "get_department_user_detals", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.getDepartmentUserDetails(req, res, next);
});

/** Routing is used to get organization**/
app.all(moduleApisPath + "get_organization", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.getOrganization(req, res, next);
});

/** Routing is used to get department user list**/
app.all(moduleApisPath + "get_department_user_list", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.getDepartmentUserList(req, res, next);
});

/** Routing is used to get user role**/
app.all(moduleApisPath + "get_user_roles", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.getUserRoles(req, res, next);
});

/** Routing is used to login by super admin**/
app.all(moduleApisPath + "login_by_super_admin", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.loginBySuperAdmin(req, res, next);
});

/** Routing is used to get contact us listing**/
app.all(moduleApisPath + "active_deactive_user", middlewareReuestAllApis, function (req, res, next) {
	superadminApi.activeDeactiveUser(req, res, next);
});
/***************************************** END SUPER ADMIN ROUTING API *****************************************/

/***************************************** START ORGANIZATION USER ROUTING API *****************************************/
var organizationApi = require(WEBSITE_MODULES_PATH + "api/model/organization");
const { addOrganizationValidationRules, updateOrganizationValidationRules } = require(WEBSITE_VALIDATION_FOLDER_PATH + 'organization_validation.js');

/** Routing is used to add Organization */
app.all(moduleApisPath + "add_organization", middlewareReuestAllApis, addOrganizationValidationRules(), validateResponseReturn, function (req, res, next) {
	organizationApi.addOrganization(req, res, next);
});

/** Routing is used to update Organization */
app.all(moduleApisPath + "update_organization", middlewareReuestAllApis, updateOrganizationValidationRules(), validateResponseReturn, function (req, res, next) {
	organizationApi.updateOrganization(req, res, next);
});

/** Routing is used to organization details */
app.all(moduleApisPath + "organization_details", middlewareReuestAllApis, function (req, res, next) {
	organizationApi.organizationDetails(req, res, next);
});

/** Routing is used to get parent organization listing */
app.all(moduleApisPath + "get_parent_organization", middlewareReuestAllApis, function (req, res, next) {
	organizationApi.getParentOrganization(req, res, next);
});

/** Routing is used to get organization listing */
app.all(moduleApisPath + "get_organization_list", middlewareReuestAllApis, function (req, res, next) {
	organizationApi.getOrganizationList(req, res, next);
});

/***************************************** END ORGANIZATION USER ROUTING API *****************************************/


/***************************************** START DASHBOARD USER ROUTING API *****************************************/
var dashboardApi = require(WEBSITE_MODULES_PATH + "api/model/dashboard");

/** Routing is used to get metabase dashboard*/
app.all(moduleApisPath + "get_metabase_dashbord", middlewareReuestAllApis, function (req, res, next) {
	dashboardApi.getMetabaseDashbord(req, res, next);
});

/** Routing is used to metabase dashboard details*/
app.all(moduleApisPath + "metabase_dashbord_details", middlewareReuestAllApis, function (req, res, next) {
	dashboardApi.metabaseDashbordDetails(req, res, next);
});

/** Routing is used to get superset dashboard*/
app.all(moduleApisPath + "get_superset_dashbord_list", middlewareReuestAllApis, function (req, res, next) {
	dashboardApi.getSupersetDashbordList(req, res, next);
});

/** Routing is used to get superset dashboard details*/
app.all(moduleApisPath + "get_superset_dashbord_details", middlewareReuestAllApis, function (req, res, next) {
	dashboardApi.getSupersetDashbordDetails(req, res, next);
});

/***************************************** END DASHBOARD USER ROUTING API *****************************************/