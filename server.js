var mongo_db = 'mongodb://heroku_cq2xx7v8:qqrd50ogsvskvfankuo572ijra@ds125716.mlab.com:25716/heroku_cq2xx7v8';

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require('path');

var app = express();
var PORT = process.env.PORT || 3000;
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
	flags: 'a'
});

// Use morgan logger for logging requests
app.use(logger('dev', {
	stream: accessLogStream
}))
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
	extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(mongo_db, {
	useMongoClient: true
});

//Set routes
require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});
