const async = require('async');
const tokenList = {};

function Organization() {

	/**
	 * Funcion used to add Organization
	 * @param {} req 
	 * @param {*} res 
	 */
	this.addOrganization = async (req, res) => {

		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};

		let organizationName = (req.body.organization_name) ? req.body.organization_name : "";
		let parentOrganization = (req.body.parent_organization) ? convertToObjectId(req.body.parent_organization) : "";
		let email = (req.body.email) ? (req.body.email).toLowerCase() : "";
		let phone = (req.body.phone) ? req.body.phone : "";
		let country = (req.body.country) ? req.body.country : "";
		let state = (req.body.state) ? req.body.state : "";
		let city = (req.body.city) ? req.body.city : "";
		let street = (req.body.street) ? req.body.street : "";
		let zipCode = (req.body.zip_code) ? req.body.zip_code : "";
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
				title: organizationName,
				table_name: TABLE_ORGANIZATION,
				slug_field: "slug"
			};

			try {
				// Generate Unique Slug (Await the Promise here)
				const slugResponse = await uniueGenerateDatabaseSlug(userSlugOptions);
				let uniqueSlug = (slugResponse.title) ? slugResponse.title : "";

				// Prepare the organization object to insert
				const organizationInsertObject = {
					'user_id': userId,
					'organization_name': organizationName,
					'parent_organization': parentOrganization,
					'email': email,
					'phone': phone,
					'country': country,
					'zip_code': zipCode,
					'state': state,
					'city': city,
					'street': street,
					'slug': uniqueSlug,
					"is_active": ACTIVE,
					"is_deleted": NOT_DELETED,
					"ip": ipAddress,
					'created': getUtcDate(),
					'modified': getUtcDate(),
				};
				const collection = db.collection(TABLE_ORGANIZATION);

				// Insert user document into the collection
				const insertResult = await collection.insertOne(organizationInsertObject);

				/**send message */
				if (insertResult.acknowledged) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'result': {},
							'message': ORGANIZATION_ADDED_SUCCESSFULLY
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
	 * Function for used to update organization
	 */
	this.updateOrganization = async (req, res) => {
		/** Sanitize Data **/
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};

		let updateOrganizationSlug = (req.body.organization_slug) ? req.body.organization_slug : "";
		let organizationName = (req.body.organization_name) ? req.body.organization_name : "";
		let parentOrganization = (req.body.parent_organization) ? convertToObjectId(req.body.parent_organization) : "";
		let email = (req.body.email) ? (req.body.email).toLowerCase() : "";
		let phone = (req.body.phone) ? req.body.phone : "";
		let country = (req.body.country) ? req.body.country : "";
		let state = (req.body.state) ? req.body.state : "";
		let city = (req.body.city) ? req.body.city : "";
		let street = (req.body.street) ? req.body.street : "";
		let zipCode = (req.body.zip_code) ? req.body.zip_code : "";

		if (!userId || !updateOrganizationSlug) {
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
				const organizationCollection = db.collection(TABLE_ORGANIZATION);

				/** User detials */
				const updatedUserRecord = await organizationCollection.findOne({ 'slug': updateOrganizationSlug });
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
					'organization_name': organizationName,
					'parent_organization': parentOrganization,
					'email': email,
					'phone': phone,
					'country': country,
					'state': state,
					'city': city,
					'street': street,
					'zip_code': zipCode,
					'modified_user_id': userId,
					'modified': getUtcDate(),
				};

				// Update organization data
				const updateResult = await organizationCollection.updateOne({ 'slug': updateOrganizationSlug }, { $set: updatedData });
				/**send message */
				if (updateResult.acknowledged) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_SUCCESS,
							'result': {},
							'message': ORGANIZATION_UPDATED_SUCCESSFULLY
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
	 * Function used to get organization details
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.organizationDetails = async (req, res) => {
		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let organizationSlug = (req.body.organization_slug) ? req.body.organization_slug : "";

		if (!userId || !organizationSlug) {
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
			"is_deleted": NOT_DELETED,
			"slug": organizationSlug
		};

		/** Set options data for get user details **/
		const organizationCollection = db.collection(TABLE_ORGANIZATION);
		let resultDetails = await organizationCollection.findOne(conditions);

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
	}


	/**
	 * Function used to get parent Organization
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.getParentOrganization = async (req, res) => {
		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";
		let organizationSlug = (req.body.organization_slug) ? req.body.organization_slug : "";

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

		if (organizationSlug != '') {
			conditions['slug'] = { $ne: organizationSlug }
		}

		/** Set options data for get user details **/
		const organizationCollection = db.collection(TABLE_ORGANIZATION);
		let resultDetails = await organizationCollection.find(conditions, { projection: { "organization_name": 1 } }).sort({ 'created': SORT_DESC }).toArray();

		if (resultDetails) {
			resultDetails.unshift({ '_id': "", 'organization_name': ORGANIZATION_PLEASE_SELECT_ORGANIZATION })
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
	}


	/**
	 * Function to get Organization user list
	 *
	 * @return json 
	 **/
	this.getOrganizationList = async (req, res, next) => {

		let finalResponse = {};
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		/** get user id get **/
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";


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

		let skip = (limit * page) - limit;
		limit = limit;

		const organizationCollection = db.collection(TABLE_ORGANIZATION);
		let conditions = {
			"is_deleted": NOT_DELETED
		}

		// Add search filters for organization_name, email, phone, country, zip_code, state, city, street, parent_organization
		let searchOrganizationName = (req.body.search_organization_name) ? req.body.search_organization_name.trim() : "";
		let searchEmail = (req.body.search_email) ? req.body.search_email.trim() : "";
		let searchPhone = (req.body.search_phone) ? req.body.search_phone.trim() : "";
		let searchCountry = (req.body.search_country) ? req.body.search_country.trim() : "";
		let searchZipCode = (req.body.search_zip_code) ? req.body.search_zip_code.trim() : "";
		let searchState = (req.body.search_state) ? req.body.search_state.trim() : "";
		let searchCity = (req.body.search_city) ? req.body.search_city.trim() : "";
		let searchStreet = (req.body.search_street) ? req.body.search_street.trim() : "";
		let searchParentOrganization = (req.body.search_parent_organization) ? req.body.search_parent_organization.trim() : "";

		if (searchOrganizationName !== "") {
			conditions["organization_name"] = { $regex: searchOrganizationName, $options: "i" };
		}
		if (searchEmail !== "") {
			conditions["email"] = { $regex: searchEmail, $options: "i" };
		}
		if (searchPhone !== "") {
			conditions["phone"] = { $regex: searchPhone, $options: "i" };
		}
		if (searchCountry !== "") {
			conditions["country"] = { $regex: searchCountry, $options: "i" };
		}
		if (searchZipCode !== "") {
			conditions["zip_code"] = { $regex: searchZipCode, $options: "i" };
		}
		if (searchState !== "") {
			conditions["state"] = { $regex: searchState, $options: "i" };
		}
		if (searchCity !== "") {
			conditions["city"] = { $regex: searchCity, $options: "i" };
		}
		if (searchStreet !== "") {
			conditions["street"] = { $regex: searchStreet, $options: "i" };
		}
		if (searchParentOrganization !== "") {
			conditions["parent_organization"] = convertToObjectId(searchParentOrganization);
		}

		const [organizationResult, totalRecord] = await Promise.all([
			organizationCollection.aggregate([
				{ $match: conditions },
				{ $sort: { created: -1 } },
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup: {
						from: TABLE_ORGANIZATION, // same collection name
						localField: "parent_organization",
						foreignField: "_id",
						as: "parent"
					}
				},
				{
					$addFields: {
						parent_name: {
							$cond: {
								if: { $gt: [{ $size: "$parent" }, 0] },
								then: { $arrayElemAt: ["$parent.organization_name", 0] },
								else: ""
							}
						}
					}
				},
				{
					$project: {
						parent: 0 // remove the full parent object if not needed
					}
				}
			]).toArray(),

			organizationCollection.countDocuments(conditions)
		]);


		/** send response */
		if (organizationResult.length > 0) {
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': organizationResult,
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
	}

}
module.exports = new Organization();