const { body } = require('express-validator');

/**
 * Add User Department Validation Rules
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const addUserDepartmentValidationRules = (req, res) => {
	return [
		// First name validation
		body('first_name').notEmpty().withMessage(FIRST_NAME_REQUIRED),
		body('last_name').notEmpty().withMessage(LAST_NAME_REQUIRED),

		// Email validation
		body('email').notEmpty().withMessage(EMAIL_REQUIRED)
			.isEmail().withMessage(EMAIL_VALID_REQUIRED)
			.custom((value, { req, location, path }) => {
				// let userRole = (req.body.role) ? req.body.role : "";

				// Check if the email already exists
				let superAdminConditions = {
					"email": { $regex: "^" + value + "$", $options: "i" },
					// "role": userRole
				}
				return checkIfEmailExists(superAdminConditions).then((exists) => {
					if (exists) {
						return Promise.reject(EMAIL_ALREADY_EXISTS);
					}
				});
			}),

		// Username validation
		body('username').notEmpty().withMessage(USER_NAME_REQUIRED)
			.matches(/^\S*$/).withMessage(USERNAME_NO_SPACE)  // Regex to ensure no spaces in username
			.custom((value) => {
				// Check if the username already exists
				let superAdminUsernameConditions = {
					"username": { $regex: "^" + value + "$", $options: "i" },
					// "user_role_id": DEPARTMENT_ADMIN_ROLE_ID,
					// "user_type": DEPARTMENT_USER_TYPE
				}
				return checkIfUsernameExists(superAdminUsernameConditions).then((exists) => {
					if (exists) {
						return Promise.reject(USERNAME_ALREADY_EXISTS);
					}
				});
			}),

		// Password validation with regex for strong password
		body('password')
			.notEmpty().withMessage(PASSWORD_REQUIRED)
			.matches(PASSWORD_VALID_REGEX).withMessage(STRONG_PASSWORD),

		// Phone validation (numeric and length between 6-12 digits)
		body('phone').notEmpty().withMessage(PHONE_NUMBER_REQUIRED)
			.isNumeric().withMessage(PHONE_NUMBER_INVALID)
			.isLength({ min: 6, max: 12 }).withMessage(PHONE_NUMBER_INVALID),

		// Role validation
		body('role').notEmpty().withMessage(ROLE_REQUIRED)
	];
};

/**
 * update/edit User Department Validation Rules
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const updateUserDepartmentValidationRules = (req, res) => {
	return [
		// First name validation
		body('first_name').notEmpty().withMessage(FIRST_NAME_REQUIRED),
		body('last_name').notEmpty().withMessage(LAST_NAME_REQUIRED),

		// Email validation
		body('email').notEmpty().withMessage(EMAIL_REQUIRED)
			.isEmail().withMessage(EMAIL_VALID_REQUIRED)
			.custom((value, { req, location, path }) => {
				// let userRole = (req.body.role) ? req.body.role : "";
				let updateUserSlug = (req.body.update_user_slug) ? req.body.update_user_slug : "";
				// Check if the email already exists
				let superAdminConditions = {
					"email": { $regex: "^" + value + "$", $options: "i" },
					"slug": { $ne: updateUserSlug },
					// "role": userRole,
					// "user_type": DEPARTMENT_USER_TYPE
				}
				return checkIfEmailExists(superAdminConditions).then((exists) => {
					if (exists) {
						return Promise.reject(EMAIL_ALREADY_EXISTS);
					}
				});
			}),

		// Username validation
		body('username').notEmpty().withMessage(USER_NAME_REQUIRED)
			.matches(/^\S*$/).withMessage(USERNAME_NO_SPACE)  // Regex to ensure no spaces in username
			.custom((value, { req }) => {
				let updateUserSlug = (req.body.update_user_slug) ? req.body.update_user_slug : "";

				// Check if the username already exists
				let superAdminUsernameConditions = {
					"username": { $regex: "^" + value + "$", $options: "i" },
					"slug": { $ne: updateUserSlug },
					// "user_role_id": DEPARTMENT_ADMIN_ROLE_ID,
					// "user_type": DEPARTMENT_USER_TYPE
				}
				return checkIfUsernameExists(superAdminUsernameConditions).then((exists) => {
					if (exists) {
						return Promise.reject(USERNAME_ALREADY_EXISTS);
					}
				});
			}),

		// Phone validation (numeric and length between 6-12 digits)
		body('phone').notEmpty().withMessage(PHONE_NUMBER_REQUIRED)
			.isNumeric().withMessage(PHONE_NUMBER_INVALID)
			.isLength({ min: 6, max: 12 }).withMessage(PHONE_NUMBER_INVALID),

		// Role validation
		body('role').notEmpty().withMessage(ROLE_REQUIRED)
	];
};


module.exports = {
	addUserDepartmentValidationRules,
	updateUserDepartmentValidationRules
}
