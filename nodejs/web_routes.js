/** Including constants file */
require("./config/global_constant");
 
/** Including common function */
require(WEBSITE_ROOT_PATH + "utility");

/** Including middleware for routes */
require(WEBSITE_ROOT_PATH + "middleware");

/** Including cors */
var cors = require('cors');

/**Export function */
module.exports = {
	configure: function (router, mongo) {
		mongodb = mongo;
		db = mongodb.getDb();
		ObjectId = require("mongodb").ObjectID;
		app = router;

		app.use(cors());

		/** Include Api Module **/
		require(WEBSITE_MODULES_PATH + "api/routes");

		/** Route is used to for 404 page */
		app.get("/", function (req, res) {
			return res.send(`<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Welcome Page</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
							margin: 0;
							background-color: #f0f0f0;
						}
						h1 {
							color: #2c3e50;
							font-size: 3rem;
						}
					</style>
				</head>
				<body>
					<h1>Welcome to Survey Sight</h1>
				</body>
			</html>`);
		});

		/** Route is used to for 404 page */
		app.get("*", function (req, res) {
			res.status(404).json({ message: "Route not found" });
			return;
		});
	}
};
