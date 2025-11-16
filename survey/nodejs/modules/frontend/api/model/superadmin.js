const async = require('async');
const tokenList = {};

function superAdmin() {

	/**
	 * Function used to super admin login
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.superAdminLogin = (req, res) => {

		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let finalResponse = {};

		let username = (req.body.email) ? req.body.email : "";
		let simplePassword = (req.body.password) ? req.body.password : "";

		/** Set conditions **/
		let conditions = {
			// "email": { $regex: '^' + email + '$', $options: 'i' },
			"user_role_id": { $in: [SUPER_ADMIN_ROLE_ID, LOCAL_ADMIN_ROLE_ID, STANDARD_ADMIN_ROLE_ID] },
			$or: [
				{ "email": { $regex: '^' + username + '$', $options: 'i' }, },
				{ "username": { $regex: '^' + username + '$', $options: 'i' }, },
			],
		};

		/** Set options data for get user details **/
		let userOptions = {
			conditions: conditions,
		};

		try {
			/** Get user details **/
			userDetailByConditionsAccording(req, res, userOptions).then((userResponse) => {
				let resultData = (userResponse.result) ? userResponse.result : "";

				let password = (resultData.password) ? resultData.password : "";


				/** Password check */
				bcryptCheckPasswordCompare(simplePassword, password).then(function (passwordMatch) {
					if (!passwordMatch) {
						finalResponse = {
							'data': {
								'status': STATUS_ERROR,
								'result': {},
								'token': "",
								'refresh_token': "",
								'token_life': JWT_CONFIG.tokenLife,
								'message': EMAIL_AND_PASSWORD_CORRECT_MESSAGE
							}
						};
						return returnApiResult(req, res, finalResponse);
					}

					/** Check if account is deactivated */
					if (resultData.is_active == DEACTIVE && resultData.user_role_id != SUPER_ADMIN_ROLE_ID) {
						finalResponse = {
							'data': {
								'status': STATUS_ERROR,
								'result': {},
								'message': YOUR_ACCOUNT_IS_DEACTIVATED
							}
						};
						return returnApiResult(req, res, finalResponse);
					}

					/** Send success response **/
					let fullName = (resultData.full_name) ? resultData.full_name : "";

					/*** Start JWT Authentication ***/
					let userEmail = (resultData.email) ? resultData.email : "";
					let slug = (resultData.slug) ? resultData.slug : "";

					const jwtUser = {
						"email": userEmail,
						"slug": slug,
					}

					/** Function for used to login logs save data */
					userLoginLogSave(req, res, resultData).then(() => {

						/** Success msg and generate token*/
						jwtTokenGenerate(req, res, jwtUser).then(async jwtResponse => {
							tokenList['token'] = (jwtResponse.token) ? jwtResponse.token : "";
							tokenList['refresh_token'] = (jwtResponse.refresh_token) ? jwtResponse.refresh_token : "";
							returnResponse = {
								'data': {
									'status': STATUS_SUCCESS,
									'result': resultData,
									'token': (jwtResponse.token) ? jwtResponse.token : "",
									'refresh_token': (jwtResponse.refresh_token) ? jwtResponse.refresh_token : "",
									'token_life': (jwtResponse.token_life) ? jwtResponse.token_life : "",
									'message': replaceTextSettingText(YOU_ARE_LOGIN, fullName)
								}
							};
							return returnApiResult(req, res, returnResponse);
						});
					});
				});
			});
		} catch (err) {
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': {},
					'token': "",
					'refresh_token': "",
					'token_life': "",
					'message': SOMTHING_WENT_WRONG_PLEASE_TRY_AGAIN
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	};//End login()


	/**
	 * Function for used to get user roles
	 */
	this.getUserRoles = async (req, res) => {
		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let finalResponse = {};
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
			/**send error response */
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': USER_ROLE_TYPE,
					'message': "",
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	}


	/**
	 * Funcion used to add department for super admin 
	 * @param {} req 
	 * @param {*} res 
	 */
	this.addSuperAdminDepartment = async (req, res) => {
		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";


		let finalResponse = {};

		let firstName = (req.body.first_name) ? req.body.first_name : "";
		let lastName = (req.body.last_name) ? req.body.last_name : "";
		let fullName = firstName + " " + lastName;
		let email = (req.body.email) ? (req.body.email).toLowerCase() : "";
		let phone = (req.body.phone) ? req.body.phone : "";
		let organizationIds = (req.body.organization_ids) ? convertToObjectId(req.body.organization_ids) : [];
		let role = (req.body.role) ? req.body.role : "";
		let username = (req.body.username) ? req.body.username : "";
		let password = (req.body.password) ? req.body.password : "";
		let ipAddress = (req.body.ip) ? req.body.ip : "";

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

			/**slug options */
			let userSlugOptions = {
				title: fullName,
				table_name: TABLE_USERS,
				slug_field: "slug"
			};

			try {
				// Generate Unique Slug (Await the Promise here)
				const slugResponse = await uniueGenerateDatabaseSlug(userSlugOptions);
				let uniqueSlug = (slugResponse.title) ? slugResponse.title : "";

				// Generate bcrypt hashed password (Await the Promise here)
				const bcryptPassword = await bcryptPasswordGenerate(password);

				// Prepare the user object to insert
				const userDoc = {
					'first_name': firstName,
					'last_name': lastName,
					'full_name': fullName,
					'email': email,
					'phone': phone,
					'organization_ids': organizationIds,
					'role': role,
					'username': username,
					'password': bcryptPassword,  // Stored hashed password
					'slug': uniqueSlug,
					"user_role_id": USER_ROLES_AND_TYPES[role]['user_role_id'],
					"user_type": USER_ROLES_AND_TYPES[role]['user_type'],
					"is_active": ACTIVE,
					"is_deleted": NOT_DELETED,
					"ip": ipAddress,
					'created': getUtcDate(),
					'modified': getUtcDate(),
				};
				const collection = db.collection(TABLE_USERS);  // Assuming TABLE_USERS is your collection name

				// Insert user document into the collection
				const insertResult = await collection.insertOne(userDoc);

				/**send message */
				if (insertResult.acknowledged) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'result': {},
							'message': USER_ADDED_SUCCESSFULLY
						}
					};
					return returnApiResult(req, res, finalResponse);
				} else {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': {},
							'message': FAILED_TO_INSERT_DATA
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
	 * Funcion used to update department for super admin 
	 * @param {} req 
	 * @param {*} res 
	 */
	this.updateSuperAdminDepartment = async (req, res) => {
		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};

		let firstName = (req.body.first_name) ? req.body.first_name : "";
		let lastName = (req.body.last_name) ? req.body.last_name : "";
		let fullName = firstName + " " + lastName;
		let email = (req.body.email) ? (req.body.email).toLowerCase() : "";
		let phone = (req.body.phone) ? req.body.phone : "";
		let organizationIds = (req.body.organization_ids) ? convertToObjectId(req.body.organization_ids) : [];
		let role = (req.body.role) ? req.body.role : "";
		let username = (req.body.username) ? req.body.username : "";
		let updateUserSlug = (req.body.update_user_slug) ? req.body.update_user_slug : "";

		/** If password leave blank if you do not want to change password. */
		// let oldPassword = (req.body.old_password) ? req.body.old_password : "";
		// let newPassword = (req.body.new_password) ? req.body.new_password : "";
		let newPassword = (req.body.password) ? req.body.password : "";

		if (!userId || !updateUserSlug) {
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

				// Prepare the user object to insert
				const updatedData = {
					'first_name': firstName,
					'last_name': lastName,
					'full_name': fullName,
					'email': email,
					'phone': phone,
					'organization_ids': (role == STANDARD_USER_ROLE) ? organizationIds : "",
					'role': role,
					"user_role_id": USER_ROLES_AND_TYPES[role]['user_role_id'],
					"user_type": USER_ROLES_AND_TYPES[role]['user_type'],
					'username': username,
					'modified': getUtcDate(),
				};

				/** Password change user */
				if (newPassword) {
					/** New password generate */
					let newEncryptedPassword = await bcryptPasswordGenerate(newPassword);
					updatedData['password'] = newEncryptedPassword;
				}

				// update user document into the collection
				const updateResult = await userCollection.updateOne({ 'slug': updateUserSlug }, { $set: updatedData });
				/**send message */
				if (updateResult.acknowledged) {
					/**send success message */
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'result': {},
							'message': USER_UPDATED_SUCCESSFULLY
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
	 * Function used to get department user details
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.getDepartmentUserDetails = async (req, res) => {
		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let updateUserSlug = (req.body.update_user_slug) ? req.body.update_user_slug : "";

		if (!userId || !updateUserSlug) {
			/**send error response */
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
			"role": { $in: [ADMIN_USER_ROLE, STANDARD_USER_ROLE] },
			"slug": updateUserSlug
		};

		/** Set options data for get user details **/
		const users = db.collection(TABLE_USERS);
		let resultDetails = await users.findOne(conditions);

		if (resultDetails) {
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': resultDetails,
					'message': "",
				}
			};
			return returnApiResult(req, res, finalResponse);

		} else {
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': {},
					'message': NO_RECORDS_FOUND,
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	} //end getDepartmentUserDetails()


	/**
	 * Function used to get Organization
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.getOrganization = async (req, res) => {
		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		// let updateUserSlug = (req.body.update_user_slug) ? req.body.update_user_slug : "";

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
		}

		/** Set conditions **/
		let conditions = {
			"is_deleted": NOT_DELETED
		};

		// if (updateUserSlug != '') {
		// 	conditions['slug'] = { $ne: updateUserSlug }
		// }

		/** Set options data for get organization details **/
		const organizationCollection = db.collection(TABLE_ORGANIZATION);
		let resultDetails = await organizationCollection.find(conditions, { projection: { "organization_name": 1 } }).sort({ 'created': SORT_DESC }).toArray();

		if (resultDetails) {
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': resultDetails,
					'message': "",
				}
			};
			return returnApiResult(req, res, finalResponse);

		} else {
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': {},
					'message': NO_RECORDS_FOUND,
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	} //end getOrganization()


	/**
	 * Function to get department user list
	 *
	 * @return json 
	 **/
	this.getDepartmentUserList = async (req, res, next) => {

		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);

		/** Get user id get **/
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let userSlug = (loginUserData.slug) ? loginUserData.slug : "";

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
		}

		let page = (req.body.page) ? parseInt(req.body.page) : 1;
		let limit = (req.body.limit) ? parseInt(req.body.limit) : API_DEFAULT_LIMIT;
		let searchFullName = (req.body.search_full_name) ? req.body.search_full_name.trim() : "";
		let searchEmail = (req.body.search_email) ? req.body.search_email.trim() : "";
		let searchUsername = (req.body.search_username) ? req.body.search_username.trim() : "";
		let searchOrganizationId = (req.body.search_organization_id) ? req.body.search_organization_id.trim() : "";
		let searchRole = (req.body.search_role) ? req.body.search_role.trim() : "";
		let searchActive = (req.body.hasOwnProperty('search_active') && req.body.search_active !== "") ? Number(req.body.search_active) : "";

		let skip = (limit * page) - limit;
		limit = limit;

		const users = db.collection(TABLE_USERS);
		let conditions = {
			// "user_role_id": DEPARTMENT_ADMIN_ROLE_ID,
			"role": { $in: [ADMIN_USER_ROLE, STANDARD_USER_ROLE] },
			"slug": { $ne: userSlug },
			"is_deleted": NOT_DELETED
		}

		// Search by full name (case-insensitive, partial match)
		if (searchFullName !== '') {
			conditions["full_name"] = { $regex: searchFullName, $options: 'i' };
		}

		// Search by email (case-insensitive, partial match)
		if (searchEmail !== '') {
			conditions["email"] = { $regex: searchEmail, $options: 'i' };
		}

		// Search by username (case-insensitive, partial match)
		if (searchUsername !== '') {
			conditions["username"] = { $regex: searchUsername, $options: 'i' };
		}

		// Search by organization name
		if (searchOrganizationId !== '') {
			conditions["organization_ids"] = convertToObjectId(searchOrganizationId);
		}

		// Search by role
		if (searchRole !== '') {
			conditions["role"] = searchRole;
		}

		// Search by active deactive
		if (searchActive === 0 || searchActive === 1) {
			conditions["is_active"] = searchActive;
		}

		const [userResult, totalRecord] = await Promise.all([
			users.aggregate([
				{ $match: conditions },
				{ $sort: { created: SORT_DESC } },
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup: {
						from: TABLE_ORGANIZATION, // collection name
						localField: "organization_ids",
						foreignField: "_id",
						as: "organizationDetails"
					}
				},
				{ $unwind: { path: "$organizationDetails", preserveNullAndEmptyArrays: true } },
				{
					$project: {
						'_id': 1,
						'first_name': 1,
						'last_name': 1,
						'full_name': 1,
						'email': 1,
						'phone': 1,
						'role': 1,
						'user_type': 1,
						'is_active': 1,
						'username': 1,
						'slug': 1,
						'organization_ids': 1,
						'created': 1,
						'organization_name': "$organizationDetails.organization_name"
					}
				}
			]).toArray(),
			users.countDocuments(conditions)
		]);

		/** Send response */
		if (userResult.length > 0) {
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': userResult,
					'total_records': totalRecord,
					'limit': limit,
					'page': page,
					'message': "",
					'total_page': Math.ceil(totalRecord / limit)
				}
			};
			return returnApiResult(req, res, finalResponse);
		} else {
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': [],
					'total_records': 0,
					'limit': limit,
					'page': page,
					'message': NO_RECORDS_FOUND,
					'total_page': 0
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	}//end getDepartmentUserList()

	/**
	 * Function to use login by superadmin
	 *
	 * @return json 
	 **/
	this.loginBySuperAdmin = async (req, res, next) => {

		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);

		/** get user id get **/
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let userCrediantials = (req.body.user_crediantials) ? req.body.user_crediantials : "";

		let finalResponse = {};


		/**send error response */
		if (!userId || !userCrediantials) {
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': [],
					'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
				}
			};
			return returnApiResult(req, res, finalResponse);
		} else {

			/** Encode data */
			let loginData = atob(userCrediantials);
			// console.log(btoa("pawansharma11@mailinator.com#@!pawan-sharma-1-68"))
			// console.log("cGF3YW5zaGFybWExMUBtYWlsaW5hdG9yLmNvbSNAIXBhd2FuLXNoYXJtYS0xLTY4")

			/** Split crediantials data*/
			const myArray = loginData.split("#@!");

			/**seperate crediantials data */
			let email = (myArray[0]) ? myArray[0] : [];
			let uniqueSlug = (myArray[1]) ? myArray[1] : [];

			/**login condition */
			let loginUserConditions = {
				"email": { $regex: '^' + email + '$', $options: 'i' },
				"slug": { $regex: '^' + uniqueSlug + '$', $options: 'i' },
				"role": { $in: [STANDARD_USER_ROLE, SUPER_ADMIN_USER_ROLE] }
			}

			/** get user details */
			let userConditionOptions = {
				conditions: loginUserConditions,
			}
			userDetailByConditionsAccording(req, res, userConditionOptions).then(userDetailResponse => {

				if (userDetailResponse && userDetailResponse.result) {
					/** JWT options */
					const jwtUser = {
						"email": email,
						"slug": uniqueSlug,
					}

					let userDataDetails = (userDetailResponse && userDetailResponse.result) ? userDetailResponse.result : {};
					let fullName = (userDetailResponse && userDetailResponse.result && userDetailResponse.result.full_name) ? userDetailResponse.result.full_name : "";

					/** Function for used to login logs save data */
					userLoginLogSave(req, res, userDataDetails).then(() => {

						/** Success msg and generate token*/
						jwtTokenGenerate(req, res, jwtUser).then(jwtResponse => {
							/**send error message */
							finalResponse = {
								'data': {
									'status': STATUS_SUCCESS,
									'result': (userDetailResponse && userDetailResponse.result) ? userDetailResponse.result : {},
									'token': (jwtResponse.token) ? jwtResponse.token : "",
									'refresh_token': (jwtResponse.refresh_token) ? jwtResponse.refresh_token : "",
									'token_life': (jwtResponse.token_life) ? jwtResponse.token_life : "",
									'message': replaceTextSettingText(YOU_ARE_LOGIN, fullName)
								}
							};
							return returnApiResult(req, res, finalResponse);
						});
					});
				} else {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': {},
							'token': "",
							'refresh_token': "",
							'token_life': "",
							'message': UNABLE_TO_LOGIN
						}
					};
					return returnApiResult(req, res, finalResponse);
				}
			});
		}
	}

	/**
	 * Function to use to active deactive user
	 *
	 * @return json 
	 **/
	this.activeDeactiveUser = async (req, res, next) => {
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		/** get user id get **/
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let updateUserId = (req.body.update_user_id) ? convertToObjectId(req.body.update_user_id) : "";
		let status = (req.body.status) ? parseInt(req.body.status) : "";
		let statusData = (status == DEACTIVE) ? ACTIVE : DEACTIVE;

		let finalResponse = {};
		/**send error response */
		if (!userId || !updateUserId) {
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
				}
			};
			return returnApiResult(req, res, finalResponse);
		} else {
			try {
				const userCollection = db.collection(TABLE_USERS);
				/**update user status using async/await */
				const updateResult = await userCollection.updateOne(
					{ '_id': updateUserId },
					{ $set: { 'is_active': statusData } }
				);

				if (updateResult && updateResult.modifiedCount > 0) {
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'message': (status == DEACTIVE) ? USER_STATUS_HAS_BEEN_ACTIVATED_SUCCESSFULLY : USER_STATUS_HAS_BEEN_DEACTIVATED_SUCCESSFULLY,
						}
					};
				} else {
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'message': (status !== DEACTIVE) ? USER_STATUS_ALREADY_DEACTIVATED : USER_STATUS_ALREADY_ACTIVATED,
						}
					};
				}
				return returnApiResult(req, res, finalResponse);
			} catch (err) {
				console.error('Error:', err);
				/**send error message */
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'message': SOMTHING_WENT_WRONG_PLEASE_TRY_AGAIN,
					}
				};
				return returnApiResult(req, res, finalResponse);
			}
		}
	}
}
module.exports = new superAdmin();