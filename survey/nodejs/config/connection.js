const { MongoClient } = require('mongodb');
var mongoUrl = process.env.MONGO_URL;
var dbName = process.env.DATABASE;

let _db;
module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(mongoUrl, {})
            .then((client) => {
                _db = client.db(dbName); // This will "create" DB when you insert
                console.log("MongoDB Connected");
                callback();
            })
            .catch((err) => {
                callback(err);
            });
    },
    getDb: function () {
        return _db;
    }
};
