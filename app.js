/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./model/db');
var routes = require('./routes');
var user = require('./routes/user');
var customer = require('./routes/customer');
var engineer = require('./routes/engineer');

var helloworld = require('./routes/helloworld');
var hi = require('./routes/hi');

var sample = require('./routes/sample');

var dbquery = require('./routes/dbquery');
var query = require('./routes/query');

var contactus = require('./routes/contactus');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('S3CR3T'));
app.use(express.session({
	expires : new Date(Date.now() + 3600000)
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals._      = require('underscore');
app.locals.moment = require('moment');
app.locals.accounting = require('accounting');
app.locals.numeral = require('numeral');
app.locals.Today = new Date("February 24, 2014 03:15:00");

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

//Form contact us
app.get('/contactus', contactus.displayform);
app.post('/contactus',contactus.echodata);

//Workshop samples
app.get('/helloworld', helloworld.hello);
app.get('/hi', hi.hellofun);

app.get('/sample', sample.presentform);
app.post('/sample', sample.echodata);

app.get('/dbquery1', dbquery.query1);				//  DB Query Examples 
app.get('/dbquery2', dbquery.query2);
app.get('/dbquery3', dbquery.query3);
app.get('/dbquery4', dbquery.query4);
app.get('/dbquery5', dbquery.query5);
app.get('/dbquery6', dbquery.query6);
app.get('/dbquery7', dbquery.query7);
app.get('/dbquery8', dbquery.query8);
app.get('/dbquery9', dbquery.query9);
app.get('/dbquery10', dbquery.query10);
app.get('/dbquery11', dbquery.query11);
app.get('/dbquery12', dbquery.query12);


//Query Problems 1 - 7
app.get('/query1', query.query1);				//  DB Query Examples 
app.get('/query2', query.query2);
app.get('/query3', query.query3);
app.get('/query4', query.query4);
app.get('/query5', query.query5);
app.get('/query6', query.query6);
app.get('/query7', query.query7);
app.get('/queryUsers', query.queryUsers);

//Login and Validate User Routes, Logout
app.get('/login', user.loginForm);							//Display Login Form
app.post('/login', user.doLogin);							//Accept Form Data, Execute Login Action
app.get('/login/error', user.loginError);
app.post('/login/error', user.doLoginError);
app.get('/logout', user.doLogout);							//Invalidate Session and Logout.


//Customer Routes
app.get('/customer', customer.portal);
app.get('/customer/details', customer.details);				//See service order details
app.get('/customer/create', customer.create);				//Form to Create a new Service Order
app.post('/customer/create', customer.doCreate); 			//Process New Service Ticket
app.get('/customer/neworder', customer.neworder);

//engineer routes
app.get('/engineer', engineer.portal);
app.post('/engineer/accept', engineer.Accept);
app.post('/engineer/checkin', engineer.Checkin);
app.post('/engineer/checkout', engineer.Checkout);
app.get('/engineer/details', engineer.details);
app.get('/engineer/checkoutModal', engineer.checkoutModal);

//SeviceDetails


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

//testcomment