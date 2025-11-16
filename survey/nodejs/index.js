var express = require('express');
var app = express();
require('dotenv').config();

/** Use Only One JSON and URL-Encoded Middleware */
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));

/** Static Files */
var qt = require('quickthumb');
app.use('/public/', qt.static(__dirname + '/public', { type: 'resize' }));
app.use(express.static(__dirname + '/public'));

/** Use to upload files */
var fileUpload = require('express-fileupload');
app.use(fileUpload());

/** Enable CORS */
var cors = require('cors');
app.use(cors());

/**Check Environment Variables */
if (!process.env.PORT || !process.env.MAX_EXECUTION_TIME) {
  console.error('Error: Missing required environment variables');
  process.exit(1);
}

/** Connect to MongoDB */
var mongo = require("./config/connection");
mongo.connectToServer((errDb) => {
  if (!errDb) {
    /** Include Routes */
    var routes = require('./web_routes');
    routes.configure(app, mongo);

    /**  Start Server after DB is connected */
    var server = app.listen(process.env.PORT, () => {
      server.timeout = parseInt(process.env.MAX_EXECUTION_TIME);
      console.log(' Server listening on port ' + process.env.PORT);
    });

  } else {
    console.log(" DB Connection Error: ", errDb);
    process.exit(1); // Optional: Exit if DB not connected
  }
});
