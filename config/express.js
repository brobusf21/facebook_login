/* Load module dependencies */
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport');


module.exports = function(db) {
	var app = express();

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	/* Use the 'body-parser' and 'method-override' middleware functions */
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Configure the MongoDB session storage
	var mongoStore = new MongoStore({
        mongooseConnection: db.connection
    });

	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));

	/* Set the application view engine and 'views' folder */
	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	// Configure the flash messages middleware
	app.use(flash());

	// Configure the Passport middleware
	app.use(passport.initialize());
	app.use(passport.session());

	/* Load the routing files */
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	
	/* Configure static file serving */
	app.use(express.static('./public'));

	return app;
};