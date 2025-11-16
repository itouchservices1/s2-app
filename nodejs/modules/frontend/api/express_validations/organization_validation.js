const { body } = require('express-validator');

/**
 * Add organization Validation Rules
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const addOrganizationValidationRules = (req, res) => {
	return [
		// organization name validation
		body('organization_name').notEmpty().withMessage(ORGANIZATION_NAME_REQUIRED),

		// Email validation
		body('email').notEmpty().withMessage(EMAIL_REQUIRED)
			.isEmail().withMessage(EMAIL_VALID_REQUIRED)
			.custom((value) => {
				// Check if the email already exists
				let organizationConditions = {
					"email": { $regex: "^" + value + "$", $options: "i" },
				}
				return checkIfEmailOrganizationExists(organizationConditions).then((exists) => {
					if (exists) {
						return Promise.reject(EMAIL_ALREADY_EXISTS);
					}
				});
			}),

		// Phone validation (numeric and length between 6-12 digits)
		body('phone').notEmpty().withMessage(PHONE_NUMBER_REQUIRED)
			.isNumeric().withMessage(PHONE_NUMBER_INVALID)
			.isLength({ min: 6, max: 12 }).withMessage(PHONE_NUMBER_INVALID),

		// country validation
		body('country').notEmpty().withMessage(COUNTRY_REQUIRED),

		//state validation
		body('state').notEmpty().withMessage(STATE_REQUIRED),
		
		//zip code validation
		body('zip_code').notEmpty().withMessage(ZIP_CODE_REQUIRED),

		//city validation
		body('city').notEmpty().withMessage(CITY_REQUIRED),

		//street validation
		body('street').notEmpty().withMessage(STREET_REQUIRED)
	];
};

/**
 * update/edit organization Validation Rules
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const updateOrganizationValidationRules = (req, res) => {
	return [
		// organization name validation
		body('organization_name').notEmpty().withMessage(ORGANIZATION_NAME_REQUIRED),

		// Email validation
		body('email').notEmpty().withMessage(EMAIL_REQUIRED)
			.isEmail().withMessage(EMAIL_VALID_REQUIRED)
			.custom((value, { req, location, path }) => {
				let organizationSlug = (req.body.organization_slug) ? req.body.organization_slug : "";
				// Check if the email already exists
				let organizationConditions = {
					"email": { $regex: "^" + value + "$", $options: "i" },
					"slug": { $ne: organizationSlug },
				}
				return checkIfEmailOrganizationExists(organizationConditions).then((exists) => {
					if (exists) {
						return Promise.reject(EMAIL_ALREADY_EXISTS);
					}
				});
			}),

		// Phone validation (numeric and length between 6-12 digits)
		body('phone').notEmpty().withMessage(PHONE_NUMBER_REQUIRED)
			.isNumeric().withMessage(PHONE_NUMBER_INVALID)
			.isLength({ min: 6, max: 12 }).withMessage(PHONE_NUMBER_INVALID),

		// country validation
		body('country').notEmpty().withMessage(COUNTRY_REQUIRED),

		//zip code validation
		body('zip_code').notEmpty().withMessage(ZIP_CODE_REQUIRED),

		//state validation
		body('state').notEmpty().withMessage(STATE_REQUIRED),

		//city validation
		body('city').notEmpty().withMessage(CITY_REQUIRED),

		//street validation
		body('street').notEmpty().withMessage(STREET_REQUIRED)
	];
};




module.exports = {
	addOrganizationValidationRules,
	updateOrganizationValidationRules
}
