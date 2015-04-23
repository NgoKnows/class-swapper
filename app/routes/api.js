var bodyParser = require('body-parser');
var User       = require('../models/user'); // User model
var Request    = require('../models/request'); // Request Model
var Class      = require('../models/class'); //Class Model
var jwt        = require('jsonwebtoken');
var moment     = require('moment');
var config     = require('../../config');

// secret used when making tokens ;)
var secret = config.secret;

module.exports = function(app, express) {
	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
    // used when logging in and seeing if username and password are OK
    // --------------------------------------------
	// LOGIN AUTHENTICATION
	// --------------------------------------------
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('firstName lastName major class username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'This username does not exist!'
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({
	        	success: false,
	        	message: "That's the wroooong password!"
	      	});
	      } else {
	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	firstName: user.firstName,
                lastName: user.lastName,
	        	username: user.username,
                major: user.major,
                class: user.class,
                id: user._id
	        }, secret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'You get a Token!!',
	          token: token
	        });
	      }
	    }
	  });
	});

    // --------------------------------------------
	// TOKEN VERIFICATION
	// --------------------------------------------
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');
	  // checking for a token
	  var token = req.body.token || req.params.token || req.headers['x-access-token'];
	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, secret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // when the user has no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});
	  }
	});

    // ----------------------------------------------------
	// USER ROUTES (/users)
	// ----------------------------------------------------

    // ROUTE ENDING IN /users/
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (POST /users)
		.post(function(req, res) {

			var user = new User();		// create a new instance of the User model
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.class = req.body.class;
            user.major = req.body.major;

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});
		})

		// get all the users (GET /users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// ROUTE ENDING IN /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id (GET /users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.firstName) user.firstName = req.body.firstName;
                if (req.body.lastName) user.lastName = req.body.lastName;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
                if (req.body.class) user.class = req.body.class;
                if (req.body.major) user.class = req.body.major;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

    // ---------------------------------------------
	// REQUEST ROUTES (/request)
	// ---------------------------------------------

    //ROUTE ENDING IN '/requests'
    //---------------------------
	apiRouter.route('/requests')
        //adds a new request to db (POST /requests)
        .post(function(req, res) {
			var request = new Request();		// create a new instance of the Request model
			request.username = req.body.username;  // set what user is making the request
            request.wanted = req.body.wanted;  // set what class that the user wants
            request.trading = req.body.trading;  // set what classes the user is trading
            request.offering = req.body.offering;  // set what the user is offering for the class

			request.save(function(err) {
				if (err) {
					return res.send(err);
				}
				// return a message
				res.json({ message: 'Request Created!' });
			});
		})

        //gets all of the requests in the db (GET /requests)
        .get(function(req, res) {
            //gets all requests sorted by most recent
			Request.find({}, null, {sort: {date: -1}}, function(err, requests) {
				if (err) res.send(err);
				// return the requests
				res.json(requests);
			});
		});

    //ROUTE ENDING IN '/:username/requests'
    //-------------------------------------
    apiRouter.route('/:username/requests')

        //gets all requests for a user (GET /:username/requests)
        .get(function(req, res){
            console.log(req.params.username);
            Request.find({ username: req.params.username}, function(err, requests){
                if(err) res.send(err);
                //return the requests
                res.json(requests);
            });
        });

    //ROUTE ENDING IN '/requests/request_id'
    //--------------------------------------
    apiRouter.route('/requests/:request_id')

        //get the request associated with id (GET /requests/:request_id)
        .get(function(req, res){
            Request.findById(req.params.request_id, function(err, request){
                if(err) res.send(err);
                //returns the request
                res.json(request);
            });
        })

        //delete the request with this id (DELETE /requests/:request_id)
        .delete(function(req, res){
            Request.remove({
				_id: req.params.request_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
        })

        //updates the request with this id (PUT /requests/:request_id)
        .put(function(req, res) {
			Request.findById(req.params.request_id, function(err, request) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.username) request.username = req.body.username;
                if (req.body.wanted) request.wanted = req.body.wanted;
				if (req.body.trading) request.trading = req.body.trading;
                if (req.body.offering) request.offering = req.body.offering;

				// save the user
				request.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Request updated!' });
				});

			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
