const fs = require('fs');
const crypto = require('crypto');
const IV = crypto.randomBytes(16);
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const path = require('path');  // Use path module for cross-platform compatibility


/**
 * To check request method is post or get
 * @param req	As Request Data
 * @param res	As Response Data
 * @return boolean
 */
isPost = (req) => {
	if (typeof req.body !== typeof undefined && Object.keys(req.body).length != 0) {
		return true;
	} else {
		return false;
	}
}//End isPost()


/**
 * To get  date/time
 * @return date/time
 */
getUtcDate = (date, format) => {
	if (date) {
		var now = moment(date, moment.defaultFormat).toDate();
	} else {
		var now = moment().toDate();
	}
	if (format) {
		let dateFormat = require('dateformat');
		return dateFormat(now, format);
	} else {
		return now;
	}
}

/**
 * Function to encrypt a string using AES-256-CTR algorithm
 * @param {String} textString - The string to be encrypted
 * @returns {String} The encrypted string in hexadecimal format
 */
encryptCrypto = (textString) => {
	try {
		const cipher = crypto.createCipheriv("aes-256-ctr", CRYPTO_ENCRYPT_DECRYPT_API_KEY, CRYPTO_ENCRYPT_DECRYPT_API_IV);
		let crypted = cipher.update(textString, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	} catch (error) {
		console.error("encryptUsingNodeCrypto: An error occurred: ", error);
		throw error;
	}
} //End encryptCrypto();

/**
 * Function to decrypt an encrypted string using AES-256-CTR algorithm
 * @param {String} textString - The encrypted string to be decrypted
 * @returns {String} The decrypted string in UTF-8 format
 */
decryptCrypto = (textString) => {
	try {
		const decipher = crypto.createDecipheriv("aes-256-ctr", CRYPTO_ENCRYPT_DECRYPT_API_KEY, CRYPTO_ENCRYPT_DECRYPT_API_IV);
		let deciphed = decipher.update(textString, 'hex', 'utf8');
		deciphed += decipher.final('utf8');
		return deciphed;
	} catch (error) {
		console.error("decryptUsingNodeCrypto: An error occurred: ", error);
		throw error;
	}
} //End decryptCrypto();

/**
 *This function is used to string to encrypt crypto convert
 *
*/
encryptJwtToken = (encryptData) => {
	const iv = crypto.randomBytes(16); // Generate a random IV
	const key = Buffer.from(JWT_ENCRYPT_DECRYPT_API_KEY, "utf-8"); // Convert key to buffer
	const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
	let encrypted = cipher.update(encryptData, "utf8", "hex");
	encrypted += cipher.final("hex");
	return iv.toString("hex") + ":" + encrypted; // Return IV + encrypted data
}; //End encryptJwtToken();

/**
 * Function to decrypt an encrypted string using AES-128-CBC algorithm
 * @param {String} decryptData - The encrypted string to be decrypted
 * @returns {String} The decrypted string in UTF-8 format
*/
decryptJwtToken = (decryptData) => {
	const key = Buffer.from(JWT_ENCRYPT_DECRYPT_API_KEY, "utf-8"); // Convert key to buffer
	const parts = decryptData.split(":"); // Split IV and encrypted data
	const iv = Buffer.from(parts[0], "hex"); // Extract IV
	const encryptedText = Buffer.from(parts[1], "hex"); // Extract encrypted text
	const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}; //End decryptJwtToken();

/**
 * Function to generate a JSON Web Token (JWT) and a refresh token for a given user
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {String}
 */
jwtTokenGenerate = (req, res, jwtUser) => {
	return new Promise(resolve => {
		const token = jwt.sign(jwtUser, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.tokenLife });
		const refreshToken = jwt.sign(jwtUser, JWT_CONFIG.refreshTokenSecret, { expiresIn: JWT_CONFIG.refreshTokenLife });

		return resolve({
			token: encryptJwtToken(token),
			refresh_token: encryptJwtToken(refreshToken),
			token_life: JWT_CONFIG.tokenLife
		});
	});
} //end jwtTokenGenerate();

/**
 *  Function to jwt authentication (middleware)
 *  @param req 			As Request Data
 *  @param res 			As Response Data
 *  @param jwtOption		As requested Data
 *  @return json
 */
JWTAuthentication = (req, res, jwtOption) => {
	return new Promise(resolve => {
		let token = (jwtOption && jwtOption.token) ? jwtOption.token : '';
		let secretKey = (jwtOption && jwtOption.secretKey) ? jwtOption.secretKey : '';
		let slug = (jwtOption && jwtOption.slug) ? jwtOption.slug : '';

		if (slug != "") {
			try {
				if (token) {
					token = decryptJwtToken(token);
					let tknData = token.split('.')[1];
					let decodedtknData = atob(tknData);
					decodedtknData = JSON.parse(decodedtknData);

					/*** check authention check valid user */
					if (decodedtknData['slug'] != slug) {
						/** Send error response **/
						let response = {
							status: STATUS_ERROR,
							req: req,
							result: {},
							message: "Invalid signature"
						};
						return resolve(response);
					} else {
						/** verifies secret and checks exp **/
						jwt.verify(token, secretKey, function (err, decoded) {
							if (err) {
								/** Send error response **/
								let response = {
									status: STATUS_ERROR,
									result: {},
									message: 'Invalid signature'
								};
								return resolve(response);
							} else {

								/** Send success response **/
								let response = {
									status: STATUS_SUCCESS,
									result: decoded,
									message: 'hello'
								};
								return resolve(response);
							}
						});
					}
				} else {
					/** Send error response **/
					let response = {
						status: STATUS_ERROR,
						result: {},
						message: 'Something went wrong please try again!'
					};
					resolve(response);
				}

			} catch (e) {
				/** Send error response **/
				let response = {
					status: STATUS_ERROR,
					result: {},
					message: 'Something went wrong please try again!'
				};
				resolve(response);
			}
		} else {
			/** Send success response **/
			let response = {
				status: STATUS_SUCCESS,
				result: {},
				message: 'slug not required'
			};
			return resolve(response);
		}
	});
}// end JWTAuthentication();


/**
 * Function used to generate bcrypt password. 
 * @param options	As data in Object
 * @return json
 */
bcryptPasswordGenerate = (passwordString) => {
	return new Promise(resolve => {
		const saltRounds = 10;
		if (passwordString != "") {
			bcrypt.hash(passwordString, saltRounds).then(function (bcryptPassword) {
				return resolve(bcryptPassword);
			});
		} else {
			return resolve('');
		}
	});
} //End bcryptPasswordGenerate();


/**
 * Function used to compare bcrypt password. 
 * @param options	As data in Object
 * @return json
 */
bcryptCheckPasswordCompare = (userEnterPassword, DbPassword) => {
	return new Promise(resolve => {
		if (userEnterPassword != "" && DbPassword != "") {
			bcrypt.compare(userEnterPassword, DbPassword).then(function (passwordMatched) {
				if (!passwordMatched) {
					return resolve(false);
				} else {
					return resolve(true);
				}
			});
		} else {
			return resolve(false);
		}
	});
} //End bcryptCheckPasswordCompare();

/**
 * Function to strip not allowed tags from array
 * @param array				As Data Array
 * @param notAllowedTags	As Tags to be removed
 * @return array
 */
arrayStripTags = (array, notAllowedTags) => {
	if (array.constructor === Object) {
		var result = {};
	} else {
		var result = [];
	}
	for (let key in array) {
		value = (array[key] != null) ? array[key] : '';
		if (value.constructor === Array || value.constructor === Object) {
			result[key] = arrayStripTags(value, notAllowedTags);
		} else {
			result[key] = stripHtml(value.toString().trim(), notAllowedTags);
		}
	}
	return result;
}//End arrayStripTags()

/**
 * Function to Remove Unwanted tags from html
 * @param html				As Html Code
 * @param notAllowedTags	As Tags to be removed
 * @return html
 */
stripHtml = (html, notAllowedTags) => {
	let unwantedTags = notAllowedTags;
	for (let j = 0; j < unwantedTags.length; j++) {
		html = html.replace(unwantedTags[j], '');
	}
	return html;
}//end stripHtml();

/**
 * Function for sanitize form data
 * @param data				As Request Body
 * @param notAllowedTags	As Array of not allowed tags
 * @return json
 */
sanitizeData = (data, notAllowedTags) => {
	let sanitized = arrayStripTags(data, notAllowedTags);
	return sanitized;
}//End sanitizeData()

/**
 * Function to get user data by slug
 * @param req		As	Request Data
 * @param res		As 	Response Data
 * @param options	As  object of data
 * @return json
 **/
userDetailByConditionsAccording = (req, res, options) => {
	return new Promise(async resolve => {
		let conditions = (options.conditions) ? options.conditions : {};

		/** Send error response **/
		if (!conditions) {
			return resolve({
				status: STATUS_ERROR,
				req: req,
				options: options,
				message: "Something went wrong please try again!"
			});
		}

		if (conditions && Object.keys(conditions).length > 0) {

			/** Get user details **/
			const users = db.collection(TABLE_USERS);
			let result = await users.findOne(conditions);

			/** Send success response **/
			if (!result) {
				return resolve({
					status: STATUS_ERROR,
					result: false,
					options: options,
				});
			}

			/** Send success response **/
			if (result && Object.keys(result).length > 0) {
				/** Send success response **/
				return resolve({
					'status': STATUS_SUCCESS,
					'result': result,
					'options': options,
				});

			} else {
				/** Send success response **/
				return resolve({
					'status': STATUS_ERROR,
					'result': false,
					'options': options,
				});
			}

		} else {
			return resolve({
				'status': STATUS_ERROR,
				'req': req,
				'options': options,
				'message': "Something went wrong please try again!"
			});
		}
	});
}; // end getUserDetailBySlug()



/**
 * Function used to return api result 
 * @param response	As data in Object
 * @return json
 */
returnApiResult = (req, res, response) => {
	var result = JSON.stringify(response.data);
	var utf8 = require('utf8');
	var myJSON = utf8.encode(result);
	let debugJsonView = (req.body.debugJsonView) ? req.body.debugJsonView : DEACTIVE;
	let isCrypto = (req.body.is_crypto) ? req.body.is_crypto : "";

	// User tracking function call with AxiosError handling
	(async () => {
		try {
			let loginUserData = req.user_data ? req.user_data : "";
			let userId = loginUserData._id ? loginUserData._id : "";

			// Prepare tracking data
			let cleanUrl = req.originalUrl || req.url || "";
			let responseData = response.data;
			let trackingData = {
				url: cleanUrl,
				user_id: userId,
				slug: req.body && req.body.slug ? req.body.slug : "",
				request: req.body,
				response: responseData,
				created: getUtcDate()
			};

			if (cleanUrl === "/api/super_admin_login" || cleanUrl === "/api/department_user_login" || cleanUrl === "/api/general_user_login" || cleanUrl === "/api/user_registration") {
				if (responseData.result && responseData.result._id) {
					trackingData['user_id'] = responseData.result._id;
				}
				if (responseData.result && responseData.result.slug) {
					trackingData['slug'] = responseData.result.slug;
				}
			}

			// Insert into user_tracking collection
			if (typeof db !== "undefined" && db.collection) {
				let userActivityCollection = db.collection(TABLE_USER_ACTIVITY_LOGS);
				await userActivityCollection.insertOne(trackingData);
			}
		} catch (err) {
			// Enhanced error handling for AxiosError: socket hang up
			if (err && typeof err === "object" && ((err.code === "ECONNRESET" && err.message && err.message.includes("AxiosError")) || (err.name === "AxiosError" && err.code === "ECONNRESET"))) {
				console.error("AxiosError: socket hang up detected in returnApiResult. Details:", {
					message: err.message,
					code: err.code,
					stack: err.stack,
					config: err.config
				});
			} else {
				console.error('Error in returnApiResult:', err);
			}
		}
	})();

	if (debugJsonView == 0) {
		let convertBtoA = btoa(myJSON);
		let convertEncrypt = encryptCrypto(convertBtoA);
		return res.send({
			response: (isCrypto == ACTIVE) ? convertEncrypt : convertBtoA
		});
	} else {
		return res.send({
			response: JSON.parse(myJSON)
		});
	}
} //End returnApiResult();

/** Going backwards: from bytestream, to percent-encoding, to original string.*/
b64DecodeUnicode = (str) => {
	try {
		return decodeURIComponent(escape(atob(str)));
	} catch (e) {
		console.error('Error decoding base64:', e);
		return '';
	}
}

/**
 * Function to parse validation front api
**/
parseValidationFrontApi = (validationErrors) => {
	var usedFields = [];
	var newValidations = [];
	if (Array.isArray(validationErrors)) {
		validationErrors.forEach(function (item) {
			if (usedFields.indexOf(item.path) == -1) {
				usedFields.push(item.path);
				newValidations[item.path] = [];
				newValidations[item.path].push(item.msg);
			}
		});
		let obj = {};
		for (var key in newValidations) {
			obj[key] = newValidations[key]
		}
		return obj;
	} else {
		return false;
	}
}

/**
 * Function to replace placeholders in text with dynamic values.
 * 
 * @param {string} text - The constant text with placeholder (e.g., 'Congrats! {{Dynamic_data}} You are logged in.')
 * @param {string} dynamicData - The data that needs to replace the placeholder (e.g., 'Ravi')
 * @return {string} - The updated text with dynamic data.
 */
replaceTextSettingText = (text, dynamicData) => {
	return text.replace('{{Dynamic_data}}', dynamicData);  // Replace the placeholder with dynamic data
};

/**
 * Check if email already exists in database
 * @param {string} email
 * @returns {Promise}
 */
checkIfEmailExists = (conditions) => {
	// Example: Replace with your actual DB check logic
	return new Promise(async (resolve, reject) => {
		const users = db.collection(TABLE_USERS);
		let resultUser = await users.findOne(conditions);
		if (resultUser) {
			resolve(true); // Email already exists
		} else {
			resolve(false); // Email does not exist
		}
	});
};

/**
 * Check if email already exists in organization database
 * @param {string} email
 * @returns {Promise}
 */
checkIfEmailOrganizationExists = (conditions) => {
	// Example: Replace with your actual DB check logic
	return new Promise(async (resolve, reject) => {
		const users = db.collection(TABLE_ORGANIZATION);
		let resultUser = await users.findOne(conditions);
		if (resultUser) {
			resolve(true); // Email already exists
		} else {
			resolve(false); // Email does not exist
		}
	});
};

/**
 * Check if username already exists in database
 * @param {string} username
 * @returns {Promise}
 */
checkIfUsernameExists = (conditions) => {
	// Example: Replace with your actual DB check logic
	return new Promise(async (resolve, reject) => {
		// Replace with actual database check
		const users = db.collection(TABLE_USERS);
		let resultUser = await users.findOne(conditions);
		if (resultUser) {
			resolve(true); // Username already exists
		} else {
			resolve(false); // Username does not exist
		}
	});
};

/**
 * Function to get database unique slug
 *
 * @return string
 */
uniueGenerateDatabaseSlug = (options) => {
	return new Promise(async resolve => {
		let tableName = (options && options.table_name) ? options.table_name : "";
		let title = (options && options.title) ? options.title : "";
		let slugField = (options && options.slug_field) ? options.slug_field : "";
		const slugify = require('slugify');

		if (title == '' || tableName == "") return resolve({ title: "", options: options });

		// Convert the title into a slug using slugify
		let convertTitleIntoSlug = slugify(title).toLowerCase();
		let collectionName = db.collection(String(tableName));

		/** Set conditions **/
		let conditions = {};
		conditions[slugField] = { $regex: new RegExp(convertTitleIntoSlug, "i") };

		let randomNumber = Math.floor(Math.random() * 99);

		/** Get count from the table **/
		const count = await collectionName.countDocuments(conditions);

		/** Send response **/
		resolve({
			title: (count > 0) ? convertTitleIntoSlug + '-' + count + '-' + randomNumber : convertTitleIntoSlug,
			options: options,
		});
	});
}

/**
 * Function to convert an array of strings/ObjectIds to ObjectId(s).
 * If already ObjectId, return as is. Skip invalid/null/undefined.
 * @param {Array|string|Object} ids - Array, string, or ObjectId
 * @returns {Array|ObjectId|undefined} - Array of ObjectIds, a single ObjectId, or undefined if invalid
 */
convertToObjectId = (ids) => {
	if (Array.isArray(ids)) {
		// Convert each element if string, else if valid ObjectId return as is
		return ids.map(id => {
			if (!id) return undefined;
			if (typeof id === 'string' && id.length === 24) {
				return new ObjectId(id);
			}
			if (id instanceof ObjectId) {
				return id;
			}
			return undefined;
		}).filter(Boolean);
	} else if (typeof ids === 'string' && ids.length === 24) {
		return new ObjectId(ids);
	} else if (ids instanceof ObjectId) {
		return ids;
	}
	// If invalid input is given, return undefined
	return;
}

/**
 * Function to get date in any format
 *
 * @return date string
 */
newDate = (date, format) => {
	if (date) {
		var now = new Date(date);
	} else {
		var now = new Date();
	}
	if (format) {

		const dateFormat = require('dateformat');
		const now = date ? new Date(date) : new Date();
		return format ? dateFormat(now, format) : now;
	} else {
		return now;
	}
}

/** 
 * function for used to create folder
*/
createNewFolder = (pathInput) => {
	return new Promise(resolve => {
		if (!pathInput || pathInput.trim() === "") {
			return resolve({ status: "ERROR", error: "Invalid pathInput: empty or undefined" });
		}

		try {
			fs.mkdirSync(pathInput, { recursive: true });
			resolve({ status: "SUCCESS" });
		} catch (err) {
			resolve({ status: "ERROR", error: err.message });
		}
	});
};

/** function for used to change filename */
changeValidFileName = (fileName) => {
	let fileData = (fileName) ? fileName.split('.') : [];
	let extension = (fileData) ? fileData.pop() : '';
	fileName = fileName.replace('.' + extension, '');
	fileName = fileName.replace(RegExp('[^0-9a-zA-Z-]+', 'g'), '');
	fileName = fileName.replace('.', '');
	fileName = fileName.toLowerCase();
	return fileName + '.' + extension;
}

/**
 * Function to save user login activity	
 * @return json
 **/
userLoginLogSave = async (req, res, options) => {
	const userId = options._id || "";
	const deviceType = req.body.device_type || "";
	const deviceToken = req.body.device_token || "";
	const deviceId = req.body.device_id || "";

	if (!userId) {
		return {
			'status': STATUS_ERROR,
		};
	}

	try {
		const users = db.collection(TABLE_USERS);
		const userLogins = db.collection(TABLE_USER_LOGIN_LOGS);
		const now = getUtcDate(); // Call once, reuse

		// Prepare update data
		const userUpdatedData = {
			$set: {
				'last_login': now,
				'modified': now
			}
		};

		// Perform operations in parallel
		await Promise.all([
			users.updateOne({ _id: userId }, userUpdatedData),
			userLogins.insertOne({
				'user_id': userId,
				'details': options,
				'created': now
			})
		]);
		// Success response
		return {
			'status': STATUS_SUCCESS,
		};
	} catch (error) {
		console.log(error)
		// Error response
		return {
			'status': STATUS_ERROR,
		};
	}
};