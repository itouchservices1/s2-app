// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const API_BASE_URL = 'http://10.0.0.106/api/';
const FRONT_URL = 'http://10.0.0.106';
const SUPERSET_BASE_URL   = 'http://10.0.0.106:8088/';

export const environment = {
    production                                    : false,
    DEBUG_BASE64_DATA                             : true,
    ENCRIPT_API                                   : 0,
    ENCRIPTION_KEY                                : '123456$#@$^@1ERF123456$#@$^@1ERF',
    ENCRIPTION_IV                                 : '123456$#@$^@1ERF',
    API_URL                                       : API_BASE_URL,
    REFRESH_TOKEN_URL                             : API_BASE_URL + 'regenerate_jwt',
    SITE_URL                                      : FRONT_URL + '/',
    SITE_URL_WITHOUT_SLASH                        : FRONT_URL,
    SITE_TITLE                                    : 'Demo',
    SITE_DESCRIPTION                              : 'Demo',
    SITE_KEYWORDS                                 : 'Demo',
    OTP_STATUS_ERROR_VALIDATION                   : 'otp_validation_error',
    SUCCESS_STATUS                                : 'success',
    ERROR_STATUS                                  : 'error',
    SITE_IMAGE_URL                                : '/assets/images/',
    SITE_VIDEO_URL                                : '/assets/video/',
    SITE_CSS_URL                                  : '/assets/css/',
    MAX_CHAR                                      : 250,
    ALLOWED_IMAGE_EXTENTIONS                      : ['jpg', 'jpeg', 'png','JPG', 'JPEG', 'PNG'],
    MAX_FILE_UPLOAD_LIMIT                         : 15,
    SUSPEND                                       : 1,
    UN_SUSPEND                                    : 0,
    IS_DELETED                                    : 1,
    NOT_DELETED                                   : 0,
    ALLOWED_EXCEL_EXTENTIONS                      : ["csv","xlsx"],
    ROLE_GENERAL                                  : 'general',
    ROLE_ADMIN                                    : "admin",
    ROLE_STANDARD                                 : "standard",
    AUTO_LOGOUT_TIME                              : 30,
    DISPLAY_FORMAT_DATE                           : 'MM-dd-yyy',
	WARNING_AUTO_LOGOUT_COUNTDOWN_TIME            : 30,
	SUPERSET_BASE_URL                             : SUPERSET_BASE_URL,
	SUPERSET_ROUTE                                : "s",
	METABASE_ROUTE                                : "m",
	WEB_HOOK_URL                                  : "https://apiworkflow-n8n.isas.ai/webhook/2158fadc-8b91-4dcf-a012-c6c3c9045789/chat"
}
  


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.