const axios = require('axios');
const tough = require('tough-cookie');

/** cookie jar set */
const cookieJar = new tough.CookieJar();
let client; // Declare client outside the route handler
(async () => {
	const { wrapper } = await import('axios-cookiejar-support');
	client = wrapper(axios.create({ jar: cookieJar }));
})();


function Dashboard() {
 
	/**
	 * Function used to get metabase dashboard
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.getMetabaseDashbord = async (req, res) => {
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

			let response;
			try {
				response = await fetch(`${METABASE_BASE_LIST_URL}/api/dashboard`, {
					headers: {
						'X-API-KEY': METABASE_API_KEY,
					},
				});

				// Agar response.ok false hai to throw kar dena
				if (!response.ok) {
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': [],
							'message': `Error from METABASE_BASE_LIST_URL: ${response.status}`
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

			} catch (error) {
				// console.warn(', error);

				// Backup request
				response = await fetch(`${METABASE_BASE_URL}/api/dashboard`, {
					headers: {
						'X-API-KEY': METABASE_API_KEY,
					},
				});

				if (!response.ok) {
					console.log(error)
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': [],
							'message': `Error from METABASE_BASE_URL: ${response.status}`
						}
					};
					return returnApiResult(req, res, finalResponse);
				}
			}

			/** Uske baad response.json() ya response ka use kar sakte ho*/
			const dashboardsData = await response.json();


			/**Loop through dashboards and append collection name*/
			const dashboardsWithCollection = await Promise.all(dashboardsData.map(async (dashboard) => {
				let collectionName = 'Root'; // Default if no collection_id

				if (dashboard.collection_id) {
					try {
						const collectionRes = await fetch(`${METABASE_BASE_LIST_URL}/api/collection/${dashboard.collection_id}`, {
							headers: {
								'X-API-KEY': METABASE_API_KEY,
							},
						});
						const collectionData = await collectionRes.json();
						collectionName = collectionData.name || 'Unknown';
					} catch (err) {
						collectionName = 'Error';
					}
				}

				return {
					...dashboard,
					collection_name: collectionName,
				};
			}));

			/**send success message */
			finalResponse = {
				'data': {
					'status': STATUS_SUCCESS,
					'result': dashboardsWithCollection,
					'message': ""
				}
			};
			return returnApiResult(req, res, finalResponse);
		}
	}

	/**
	 * Function used to metabase dashboard details
	 * @param {*} req 
	 * @param {*} res 
	 * @returns json response
	 */
	this.metabaseDashbordDetails = async (req, res) => {

		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};


		const dashboardId = (req.body.dashboard_id) ? Number(req.body.dashboard_id) : "";

		if (!userId || !dashboardId) {
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
			const payload = {
				resource: { dashboard: dashboardId },
				params: {},
				exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
			};

			try {
				const jwt = require('jsonwebtoken');
				const token = jwt.sign(payload, METABASE_SECRET_KEY);

				const embedUrl = METABASE_BASE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

				/** Send success message */
				finalResponse = {
					'data': {
						'status': STATUS_SUCCESS,
						'result': embedUrl,
						'message': ""
					}
				};
				return returnApiResult(req, res, finalResponse);
			} catch (error) {
				console.error('Error generating JWT:', error);
				/**send error message */
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': {},
						'message': error
					}
				};
				return returnApiResult(req, res, finalResponse);
			}
		}
	}


	/************************************************Superset****************************/

	/** Get acces token generate */
	async function getAccessToken() {
		try {
			const loginUrl = `${SUPERSET_BASE_URL}api/v1/security/login`;

			const response = await axios.post(
				loginUrl,
				{
					username: SUPERSET_USERNAME,
					password: SUPERSET_PASSWORD,
					provider: 'db',
				},
				{
					headers: {
						'Content-Type': 'application/json',
					}
				}
			);

			const accessToken = response.data.access_token;
			return accessToken;

		} catch (error) {
			console.error('Error during Superset login:', error.response?.data || error.message);
			return null;
		}
	}


	/**
	 * Functon for used to get superset dashboard
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	this.getSupersetDashbordList = async (req, res) => {
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};

		/** Send error message */
		// finalResponse = {
		// 	'data': {
		// 		'status': STATUS_SUCCESS,
		// 		'result': [{"id":10,"status":"published","dashboard_title":"Sales Dashboard"},{"id":11,"status":"published","dashboard_title":"Unicode Test"},{"id":9,"status":"published","dashboard_title":"FCC New Coder Survey 2018"},{"id":8,"status":"published","dashboard_title":"Featured Charts"},{"id":7,"status":"published","dashboard_title":"COVID Vaccine Dashboard"},{"id":6,"status":"published","dashboard_title":"Video Game Sales"},{"id":5,"status":"published","dashboard_title":"Slack Dashboard"},{"id":4,"status":"published","dashboard_title":"deck.gl Demo"},{"id":2,"status":"published","dashboard_title":"USA Births Names"},{"id":1,"status":"published","dashboard_title":"World Bank's Data"}],
		// 		'message': ""
		// 	}
		// };
		// return returnApiResult(req, res, finalResponse);
		
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
				let accessToken = await getAccessToken();
				const apiUrl = `${SUPERSET_BASE_URL}api/v1/dashboard/`;

				const response = await axios.get(apiUrl, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`,
					}
				});

				/**send error message */
				finalResponse = {
					'data': {
						'status': STATUS_SUCCESS,
						'result': response.data.result,
						'message': ""
					}
				};
				return returnApiResult(req, res, finalResponse);
			} catch (error) {
				console.log(error)
				/**send error message */
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': [],
						'message': error
					}
				};
				return returnApiResult(req, res, finalResponse);
			}
		}
	}

	/**
	 * Function for used to get superset detals
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	this.getSupersetDashbordDetails = async (req, res) => {
		req.body = sanitizeData(req.body, NOT_ALLOWED_TAGS_XSS);
		let loginUserData = (req.user_data) ? req.user_data : "";
		let userId = (loginUserData._id) ? loginUserData._id : "";

		let finalResponse = {};
		const dashboardId = (req.body.dashboard_id) ? Number(req.body.dashboard_id) : "";

		if (!userId || !dashboardId) {
			/**send error response */
			finalResponse = {
				'data': {
					'status': STATUS_ERROR,
					'result': "",
					'message': YOU_ARE_NOT_ALLOW_TO_ACCESS_THIS_PAGE,
				}
			};
			return returnApiResult(req, res, finalResponse);
		} else {
			try {
				if (!client) {
					const { wrapper } = await import('axios-cookiejar-support');
					client = wrapper(axios.create({ jar: cookieJar }));
				}
				/** generate access token */
				let accessToken = await getAccessToken();
				if (!accessToken) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': "",
							'message': "Failed to authenticate with Superset."
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

				/** Get csrf token */
				const csrfToken = await getCsrfToken(accessToken);
				if (!csrfToken) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': "",
							'message': "Failed to fetch CSRF token."
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

				/** Get guest token */
				const guestToken = await getSupersetGuestToken(dashboardId, csrfToken, accessToken);
				if (!guestToken) {
					/**send error message */
					finalResponse = {
						'data': {
							'status': STATUS_ERROR,
							'result': "",
							'message': "Failed to generate guest token."
						}
					};
					return returnApiResult(req, res, finalResponse);
				}

				/** Get embed url */
				const embedUrl = `${SUPERSET_BASE_URL}superset/dashboard/${dashboardId}/?standalone=true&guest_token=${guestToken}`;

				// Optional: log URL for debugging
				// console.log("Embed URL =>", embedUrl);

				const uuidEmbededApiUrl = `${SUPERSET_BASE_URL}api/v1/dashboard/${dashboardId}/embedded`;

				const responseUUID = await axios.get(uuidEmbededApiUrl, {
					headers: {
						'accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`,
					}
				});

				/**Send Success message */
				finalResponse = {
					'data': {
						'status': STATUS_SUCCESS,
						'result': embedUrl,
						'guest_token': guestToken,
						'embed_uuid': (responseUUID.data && responseUUID.data.result && responseUUID.data.result.uuid) ? responseUUID.data.result.uuid : "",
						'message': ""
					}
				};
				return returnApiResult(req, res, finalResponse);

			} catch (error) {
				console.error('Error in dashboard embed:', error);
				/**send Success message */
				finalResponse = {
					'data': {
						'status': STATUS_ERROR,
						'result': "",
						'message': error
					}
				};
				return returnApiResult(req, res, finalResponse);
			}
		}
	}

	/**
	 * Function for used to get csrf token generate
	 * @param {*} accessToken 
	 * @returns 
	 */
	async function getCsrfToken(accessToken) {
		try {
			const response = await client.get(SUPERSET_CSRF_TOKEN_ENDPOINT, {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
				},
			});
			return response.data.result; // Adjust based on the actual response structure
		} catch (error) {
			console.error('Error fetching CSRF token:', error.response ? error.response.data : error.message);
			return null;
		}
	}

	/***
	 * function for used to get Superset Guest Token generate
	 */
	async function getSupersetGuestToken(dashboardId, csrfToken, accessToken, userId = 'guest') {
		try {
			const response = await client.post(
				SUPERSET_GUEST_TOKEN_ENDPOINT,
				{
					resources: [
						{
							type: 'dashboard',
							id: dashboardId.toString(),
						},
					],
					user: {
						username: userId,
						first_name: 'Guest',
						last_name: 'User',
					},
					rls: [],
				},
				{
					headers: {
						'accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`,
						'X-CSRFToken': csrfToken, // Include the fetched CSRF token
					},
				}
			);
			return response.data.token;
		} catch (error) {
			console.error('Error generating guest token:', error.response ? error.response.data : error.message);
			return null;
		}
	}
}
module.exports = new Dashboard();