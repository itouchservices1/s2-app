/** require database */
require("./database_tables");

/** require textsetting */
require("./text_settings");

const path = require('path');
WEBSITE_ROOT_PATH = path.resolve(__dirname, '..') + '/';

/** Website Header Auth Key for mobile api */
WEBSITE_HEADER_AUTH_KEY = process.env.API_HEADER_AUTH_KEY;

/** Website/Socket URL for live/uat/demo*
WEBSITE_URL			=	process.env.URL+"/";

*/

/** Website Url for local*/
WEBSITE_URL = process.env.URL + ":" + process.env.PORT + "/";

/** Mail hi/Dear constatnt */
DEAR_HI_CONSTANT = "Hi";

/** SMTP secure port **/
SMTP_SECURE_PORT = 465;

/** Front end folder name */
FRONT_END_FOLDER_NAME = "frontend";

/**SRC rooth path */
WEBSITE_SRC_ROOT_PATH = WEBSITE_ROOT_PATH + "modules/";

/** Website public directory path */
WEBSITE_PUBLIC_PATH = WEBSITE_URL + "public/";

/** Website public folder path of front end*/
WEBSITE_FILES_URL = WEBSITE_URL + FRONT_END_FOLDER_NAME + "/";

/** Website images directory url */
WEBSITE_IMG_URL = WEBSITE_FILES_URL + "images/";

/** Website public images directory url */
WEBSITE_PUBLIC_IMG_URL = WEBSITE_PUBLIC_PATH + FRONT_END_FOLDER_NAME + "/images/";

/** Website Modules root path */
WEBSITE_MODULES_PATH = WEBSITE_SRC_ROOT_PATH + FRONT_END_FOLDER_NAME + "/";

/** Validation root path */
WEBSITE_VALIDATION_FOLDER_PATH = WEBSITE_SRC_ROOT_PATH + "frontend/api/express_validations/";

/** Website public uploads directory path */
WEBSITE_PUBLIC_UPLOADS_PATH = WEBSITE_PUBLIC_PATH + "uploads/";

/** Website upload directory root path */
WEBSITE_UPLOADS_ROOT_PATH = WEBSITE_ROOT_PATH + "public/uploads/";

/** Not allowed html tags list*/
NOT_ALLOWED_TAGS_XSS = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi];

/***Password constant */
PASSWORD_VALID_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** Define upload image size **/
UPLOAD_FILE_SIZE = 2;

/** Admin Role id*/
SUPER_ADMIN_ROLE_ID = "65fd41b32fd4cd279c9f3045";
LOCAL_ADMIN_ROLE_ID = "68224f1068e4b90a18be4d31"
STANDARD_ADMIN_ROLE_ID = "65fd41b32fd4cd279c9f3046"

/** This constant used user type*/
SUPER_ADMIN_USER_TYPE = "super_admin";
LOCAL_ADMIN_USER_TYPE = "local_admin";
STANDARD_USER_TYPE = "standard";

/** User Front user Role Define */
SUPER_ADMIN_USER_ROLE = "super_admin";
ADMIN_USER_ROLE = "admin";
STANDARD_USER_ROLE = "standard";

/*** User front role type */
USER_ROLE_TYPE = [
	{
		'type': ADMIN_USER_ROLE,
		'name': 'Admin',
	},
	{
		'type': STANDARD_USER_ROLE,
		'name': 'Standard',
	},
]

/**save dynamic role according */
USER_ROLES_AND_TYPES = {
	[ADMIN_USER_ROLE]: {
		"user_role_id": LOCAL_ADMIN_ROLE_ID,
		"user_type": LOCAL_ADMIN_USER_TYPE
	},
	[STANDARD_USER_ROLE]: {
		"user_role_id": STANDARD_ADMIN_ROLE_ID,
		"user_type": STANDARD_USER_TYPE
	}
}
/***Set default timezone */
DEFAULT_TIME_ZONE = process.env.TZ;

ACTIVE = 1;
DEACTIVE = 0;
DELETED = 1;
NOT_DELETED = 0;
NOT_SEEN = 'not_seen';
SEEN = 'seen';

/**notification type */
NOTIFICATION_TYPE_FILE_UPLOADED = 'file_uploaded';

WEP_API_TYPE = "web";

/** Status constant */
STATUS_SUCCESS = "success";
STATUS_ERROR = "error";

API_DEFAULT_LIMIT = 10;
SORT_DESC = -1;
SORT_ASC = 1;

/*** JWT Configuration **/
JWT_CONFIG = {
	"secret": "some-secret-shit-goes-here",
	"refreshTokenSecret": "some-secret-refresh-token-shit",
	"port": 3000,
	"tokenLife": 30072000,
	"refreshTokenLife": 60072000
}
JWT_ENCRYPT_DECRYPT_API_KEY = "123456$#@$^@1ERF";
CRYPTO_ENCRYPT_DECRYPT_API_KEY = '123456$#@$^@1ERF123456$#@$^@1ERF';
CRYPTO_ENCRYPT_DECRYPT_API_IV = '123456$#@$^@1ERF';

/** upload excel status */
UPLOAD_EXCEL_PENDING = "pending";
UPLOAD_EXCEL_PROCESSING = "processing";
UPLOAD_EXCEL_COMPLETE = "complete";

/**excel extension */
ALLOWED_EXCEL_EXTENSIONS = ['csv', 'xlsx'];
ALLOWED_EXCEL_ERROR_MESSAGE = "Please select valid file, Valid file extensions are " + ALLOWED_EXCEL_EXTENSIONS.join(", ") + ".";

/** METABASE url define */
METABASE_BASE_LIST_URL = process.env.METABASE_BASE_LIST_URL;
METABASE_BASE_URL = process.env.METABASE_BASE_URL;
METABASE_API_KEY = process.env.METABASE_API_KEY;
METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

/** SUPERSET url define */
SUPERSET_BASE_URL = process.env.SUPERSET_BASE_URL;
SUPERSET_USERNAME = process.env.SUPERSET_USERNAME;
SUPERSET_PASSWORD = process.env.SUPERSET_PASSWORD;
SUPERSET_GUEST_TOKEN_ENDPOINT = `${SUPERSET_BASE_URL}/api/v1/security/guest_token/`;
SUPERSET_CSRF_TOKEN_ENDPOINT = `${SUPERSET_BASE_URL}/api/v1/security/csrf_token/`;