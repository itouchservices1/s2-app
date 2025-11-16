const crypto = require('crypto'); // For CommonJS
const { invalid } = require('moment');

function Default() {


	/**
	 * Funcion used to edit profile from login user
	 * @param {} req 
	 * @param {*} res 
	 */
	this.editProfile = async (req, res) => {
		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let updateUserSlug = (loginUserData.slug) ? loginUserData.slug : "";

		let finalResponse = {};

		let firstName = (req.body.first_name) ? req.body.first_name : "";
		let lastName = (req.body.last_name) ? req.body.last_name : "";
		let fullName = firstName + " " + lastName;
		let email = (req.body.email) ? (req.body.email).toLowerCase() : "";
		let phone = (req.body.phone) ? req.body.phone : "";
		let username = (req.body.username) ? req.body.username : "";

		if (!userId) {
			/**send error response */
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': [],
					'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
				}
			};
			return returnApiResult(req, res, finalResponse);
		} else {
			try {
				const userCollection = db.collection(TABLE_USERS);  // Assuming TABLE_USERS is your collection name

				/** User detials */
				const updatedUserRecord = await userCollection.findOne({ 'slug': updateUserSlug });
				if (!updatedUserRecord) {
					finalResponse = {
						data: {
							status: STATUS_ERROR,
							result: {},
							message: NO_RECORDS_FOUND
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

				// Prepare the user object to update
				const updatedData = {
					'first_name': firstName,
					'last_name': lastName,
					'full_name': fullName,
					'email': email,
					'phone': phone,
					'username': username,
					'modified': getUtcDate(),
				};

				// update user document into the collection
				const updateResult = await userCollection.updateOne({ 'slug': updateUserSlug }, { $set: updatedData });
				/**send message */
				if (updateResult.acknowledged) {
					/**send success message */
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'result': {},
							'message': USER_PROFILE_SUCCESSFULLY
						}
					};
					return returnApiResult(req, res, finalResponse);
				} else {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': {},
							'message': FAILED_TO_UPDATE_DATA
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

			} catch (err) {
				console.error('Error:', err);
				/**send error message */
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': {},
						'message': SOMTHING_WENT_WRONG_PLEASE_TRY_AGAIN
					}
				};
				return returnApiResult(req, res, finalResponse);
			}
		}
	}


	/**
	 * Function to use to change password for login user
	 *
	 * @return json 
	 **/
	this.changeUserPassword = async (req, res, next) => {
		try {
			req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);

			/** get user id get **/
			let loginUserData = (req.user_data) ? req.user_data : "";
			let userId = (loginUserData._id) ? loginUserData._id : "";

			let newPassword = (req.body.new_password) ? req.body.new_password : "";
			let oldPassword = (req.body.old_password) ? req.body.old_password : "";

			let finalResponse = {};

			/**send error response */
			if (!userId || !newPassword || !oldPassword) {
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': [],
						'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
					}
				};
				return returnApiResult(req, res, finalResponse);
			}

			const users = db.collection(TABLE_USERS);

			/** get user data */
			const userRecord = await users.findOne({ '_id': userId });
			if (!userRecord) {
				finalResponse = {
					data: {
						status: STATUS_ERROR,
						result: {},
						message: NO_RECORDS_FOUND
					}
				};
				return returnApiResult(req, res, finalResponse);
			}

			/** Old password match */
			const isPasswordMatch = await bcryptCheckPasswordCompare(oldPassword, userRecord.password);

			if (!isPasswordMatch) {
				finalResponse = {
					data: {
						status: STATUS_ERROR,
						result: {},
						message: OLD_PASSWORD_INCORRECT
					}
				};
				return returnApiResult(req, res, finalResponse);
			}

			/** New password generate */
			const newEncryptedPassword = await bcryptPasswordGenerate(newPassword);
			await users.updateOne(
				{ _id: userId },
				{
					$set: {
						'password': newEncryptedPassword,
						'modified': getUtcDate()
					}
				}
			);

			/** send message */
			finalResponse = {
				data: {
					status: STATUS_SUCCESS,
					result: {},
					message: PASSWORD_UPDATED_SUCCESSFULLY
				}
			};
			return returnApiResult(req, res, finalResponse);
		} catch (error) {
			console.error("Password change error: ", error);
			let finalResponse = {
				data: {
					status: STATUS_ERROR,
					result: {},
					message: SOMTHING_WENT_WRONG_PLEASE_TRY_AGAIN
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	};


	/**
	 * Function to use to get user details
	 *
	 * @return json 
	 **/
	this.getUserDetail = async (req, res, next) => {
		try {
			req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);

			/** get user id get **/
			let loginUserData = (req.user_data) ? req.user_data : "";
			let userId = (loginUserData._id) ? loginUserData._id : "";
			let finalResponse = {};

			/**send error response */
			if (!userId) {
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': [],
						'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
					}
				};
				return returnApiResult(req, res, finalResponse);
			}

			/** Set conditions **/
			let conditions = {
				"_id": userId,
			};
			/** Set options data for get user details **/
			let userOptions = {
				conditions: conditions,
			};

			/** Get user details **/
			userDetailByConditionsAccording(req, res, userOptions).then((userResponse) => {
				let resultData = (userResponse.result) ? userResponse.result : "";
				returnResponse = {
					'data': {
						'status': STATUS_SUCCESS,
						'result': resultData,
						'message': ""
					}
				};
				return returnApiResult(req, res, returnResponse);
			});
		} catch (error) {
			console.error("Password change error: ", error);
			let finalResponse = {
				data: {
					status: STATUS_ERROR,
					result: {},
					message: SOMTHING_WENT_WRONG_PLEASE_TRY_AGAIN
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	};


}
module.exports = new Default();