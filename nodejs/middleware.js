const fs = require('fs');
const crypto = require('crypto');
const IV = crypto.randomBytes(16);
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const path = require('path');  // Use path module for cross-platform compatibility

/** super admin middleware */
middlewareReuestAllApis = (req, res, next) => {
	var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress

 	if (ip.substr(0, 7) == "::ffff:") {
		ip = ip.substr(7)
	}

	let defaultTimeZone = DEFAULT_TIME_ZONE;
 	let geo = geoip.lookup(ip);
	if (geo && geo.timezone) {
		defaultTimeZone = geo.timezone;
	}

	var inputData = (req.body.req) ? req.body.req : "";
	var debugJsonView = (req.body.debug_json_view) ? req.body.debug_json_view : 0;
	var isCrypto = (req.body.is_crypto) ? Number(req.body.is_crypto) : DEACTIVE;
	let apiType = (req.body.api_type) ? req.body.api_type : WEP_API_TYPE;

	var decodedData = false;

	/** Blank validation **/
	if (inputData != '') {

		var decodedData = "";
		if (debugJsonView && inputData.indexOf("{") === 0) {
			decodedData = inputData;
		} else {
			/** crypto wise and base64wise conditions **/
			if (isCrypto == ACTIVE && apiType == WEP_API_TYPE) {
				inputData = decryptCrypto(inputData)
			}
			decodedData = b64DecodeUnicode(inputData);
		}

		var APIData = JSON.parse(decodedData);
		req.body = (APIData.data) ? APIData.data : {};
		req.body.limit = API_DEFAULT_LIMIT;
		req.body.ip = ip;
		req.body.default_timezone = defaultTimeZone;

		/*** Start trim post data for all api */
		let bodyData = (req && req.body) ? req.body : {};
		Object.keys(bodyData).forEach(k => bodyData[k] = (typeof bodyData[k] == 'string') ? bodyData[k].trim() : bodyData[k]);
		/*** End trim post data for all api */

		/** User slug accourding fetch  data**/
		let slug = (req.body.slug) ? req.body.slug : "";
		let conditionOptions = {}
		if (slug != "") {
			conditionOptions = {
				conditions: { slug: slug },
			}
		}
		/** JWT Authentication verify **/
		let jwtOption = {
			token: (req.headers.authorization) ? req.headers.authorization : "",
			secretKey: JWT_CONFIG.secret,
			slug: (req.body.slug) ? req.body.slug : "",
		}
		JWTAuthentication(req, res, jwtOption).then(responseData => {
			req.body['debugJsonView'] = debugJsonView;
			if (responseData.status != STATUS_SUCCESS) {
				let returnResponse = {
					'data': {
						status: STATUS_ERROR,
						message: "Invalid access",
					}
				};
				return returnApiResult(req, res, returnResponse);
			}
			/** get user details */
			userDetailByConditionsAccording(req, res, conditionOptions).then(userDetailResponse => {

				if (slug != "" && userDetailResponse.status == STATUS_SUCCESS) {
					req.user_data = (userDetailResponse.result) ? userDetailResponse.result : {};
				}

				/** By common key use by default send*/
				req.body['api_type'] = apiType;
				req.body['is_crypto'] = isCrypto;
				return next();
			});
		})
	} else {
		res.send({
			message: "Invalid access",
			status: STATUS_ERROR,
		});
	}
}