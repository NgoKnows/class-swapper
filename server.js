//CALLING REQUIRED PACKAGES
var express    = require('express');
var app        = express(); 				// express
var bodyParser = require('body-parser'); 	// get body-parser for reading POST request
var morgan     = require('morgan'); 		// to see incoming requests
var mongoose   = require('mongoose');       // for applying schema to db
var config 	   = require('./config');       // variables shared throughout
var path 	   = require('path');

//body parser allows us to read POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to local database (for now) mongodb://localhost/db_name
mongoose.connect(config.database);

//set the location where our static files are located (css, html, js)
app.use(express.static(__dirname + '/public'));

//sets our API routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//starting the server
console.log('Magic happens on port 8080.');
app.listen(config.port);
