const { body, validationResult } = require('express-validator');


/**
 * Function for validate response return
 *
 * @param req As Request Data
 * @param res As Response Data
 *
 * @return json
 */
const validateResponseReturn = (req, res, next) => {
    if (isPost(req)) {
        const allErrors = validationResult(req)
        if (allErrors.isEmpty()) {
            return next()
        }

        // let apiType = (req.body.api_type) ? req.body.api_type : ADMIN_API_TYPE;
        let formErrors = parseValidationFrontApi(allErrors.errors);
        /** return message */
        let finalResponse = {
            'data': {
                status: STATUS_ERROR,
                errors: formErrors,
                message: "",
            }
        };
        returnApiResult(req, res, finalResponse);
    } else {
        return next()
    }
}


/**
 * Function for login validation 
 *
 * @return json
 */
const loginValidationRules = () => {
    return [
        body('email').notEmpty().withMessage(EMAIL_REQUIRED),
        body('password').notEmpty().withMessage(PASSWORD_REQUIRED)
    ]
}


/**
 * Edit profile validation rules
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const editProfileValidationRules = (req, res) => {
    return [
        // First name validation
        body('first_name').notEmpty().withMessage(FIRST_NAME_REQUIRED),
        body('last_name').notEmpty().withMessage(LAST_NAME_REQUIRED),

        // Email validation
        body('email').notEmpty().withMessage(EMAIL_REQUIRED)
            .isEmail().withMessage(EMAIL_VALID_REQUIRED)
            .custom((value, { req, location, path }) => {
                let loginUserData = (req.user_data) ? req.user_data : "";
                let updateUserSlug = (loginUserData.slug) ? loginUserData.slug : "";

                // Check if the email already exists
                let editProfileEmailCondition = {
                    "email": { $regex: "^" + value + "$", $options: "i" },
                    "slug": { $ne: updateUserSlug },
                }
                return checkIfEmailExists(editProfileEmailCondition).then((exists) => {
                    if (exists) {
                        return Promise.reject(EMAIL_ALREADY_EXISTS);
                    }
                });
            }),

        // Username validation
        body('username').notEmpty().withMessage(USER_NAME_REQUIRED)
            .matches(/^\S*$/).withMessage(USERNAME_NO_SPACE)  // Regex to ensure no spaces in username
            .custom((value, { req }) => {
                let loginUserData = (req.user_data) ? req.user_data : "";
                let updateUserSlug = (loginUserData.slug) ? loginUserData.slug : "";

                // Check if the username already exists
                let editProfileUsernameConditions = {
                    "username": { $regex: "^" + value + "$", $options: "i" },
                    "slug": { $ne: updateUserSlug },
                }
                return checkIfUsernameExists(editProfileUsernameConditions).then((exists) => {
                    if (exists) {
                        return Promise.reject(USERNAME_ALREADY_EXISTS);
                    }
                });
            }),
    ];
};

/**
 * update password for login user
 * @param {Request} req
 * @param {Response} res
 * @returns {Array}
 */
const changePasswordForLoginUserValidateRules = (req, res) => {
    return [
        // Password validation with regex for strong password
        body('new_password')
            .notEmpty().withMessage(PASSWORD_REQUIRED)
            .matches(PASSWORD_VALID_REGEX).withMessage(STRONG_PASSWORD),
    ];
};
module.exports = {
    validateResponseReturn,
    loginValidationRules,
    editProfileValidationRules,
    changePasswordForLoginUserValidateRules,
}
