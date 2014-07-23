var mongoose = require('mongoose');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Status = mongoose.model('Status');
var ProblemType = mongoose.model('ProblemType');
var PMType = mongoose.model('PMType');
var Priority = mongoose.model('Priority');
var Equipment = mongoose.model('Equipment');
var ServiceOrder = mongoose.model('ServiceOrder');
var _ = require('underscore');
var async = require('async');


exports.portal = function(req, res){
	if (!req.session.loggedIn){
        res.redirect('/login');
    }else {
		var myOrders = [];
		var myOnsite = [];
		var myAssigned = [];
		console.log('My Session worked because My name is: ' + req.session.user.FirstName);
		console.log(req.session.user._id)
		async.parallel([
			function(callback){
				ServiceOrder.find({ CloseDate: { $exists: false}})
				.where('_AssignedTo').equals(req.session.user._id)
				.where('CurrentStatus').equals('On-site')
				.populate('_Product')
				.populate('_Equipment')
				.populate('_CreatedBy')
				.sort('PriorityDescription')
				.exec(function (err, ServiceOrder){
					ServiceOrder.forEach(function(ServiceOrder){
						myOnsite.push({
							"_id": ServiceOrder._id,
							"PriorityDescription": ServiceOrder.PriorityDescription,
							"CustomerName": ServiceOrder._CreatedBy.CustomerName,
							"Street": ServiceOrder._CreatedBy.Street,
							"City": ServiceOrder._CreatedBy.City,
							"Phone": ServiceOrder.CustomerContactInfo.Phone,
							"Email": ServiceOrder.CustomerContactInfo.Email,
							"_Equipment": ServiceOrder._Equipment.SerialNumber,
							"_Product": ServiceOrder._Product.ProductName,
							"OpenDate": ServiceOrder.OpenDate,
							"ProblemTypeDescription": ServiceOrder.ProblemTypeDescription,
							"ProblemNotes": ServiceOrder.ProblemNotes,
							"CustomerContactInfo": ServiceOrder.CustomerContactInfo
							//"CurrentStatus": ServiceOrder.CurrentStatus
						});
						//console.log(myOrders);
					});
					callback();
				});
				
			},
			function(callback){
				ServiceOrder.find({ CloseDate: { $exists: false}})
				.where('_AssignedTo').equals(req.session.user._id)
				.where('CurrentStatus').equals('Accepted')
				//.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus _Equipment _Product')
				.populate('_Product')
				.populate('_Equipment')
				.populate('_CreatedBy')
				.sort('PriorityDescription')
				.exec(function (err, ServiceOrder){
					ServiceOrder.forEach(function(ServiceOrder){
						myOrders.push({
							"_id": ServiceOrder._id,
							"PriorityDescription": ServiceOrder.PriorityDescription,
							"CustomerName": ServiceOrder._CreatedBy.CustomerName,
							"Street": ServiceOrder._CreatedBy.Street,
							"City": ServiceOrder._CreatedBy.City,
							"Phone": ServiceOrder.CustomerContactInfo.Phone,
							"Email": ServiceOrder.CustomerContactInfo.Email,
							"_Equipment": ServiceOrder._Equipment.SerialNumber,
							"_Product": ServiceOrder._Product.ProductName,
							"OpenDate": ServiceOrder.OpenDate,
							"ProblemTypeDescription": ServiceOrder.ProblemTypeDescription,
							"ProblemNotes": ServiceOrder.ProblemNotes,
							"CustomerContactInfo": ServiceOrder.CustomerContactInfo
							//"CurrentStatus": ServiceOrder.CurrentStatus
						});
						//console.log(myOrders);
					});
					callback();
				});
				
			},
			function(callback){
				ServiceOrder.find({ CloseDate: { $exists: false}})
				.where('_AssignedTo').equals(req.session.user._id)
				.where('CurrentStatus').equals('Assigned, Waiting to be Accepted')
				//.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus _Equipment _Product')
				.populate('_Product')
				.populate('_Equipment')
				.populate('_CreatedBy')
				.sort('PriorityDescription')
				.exec(function (err, ServiceOrder){
					ServiceOrder.forEach(function(ServiceOrder){
						myAssigned.push({
							"_id": ServiceOrder._id,
							"PriorityDescription": ServiceOrder.PriorityDescription,
							"CustomerName": ServiceOrder._CreatedBy.CustomerName,
							"Street": ServiceOrder._CreatedBy.Street,
							"City": ServiceOrder._CreatedBy.City,
							"Phone": ServiceOrder.CustomerContactInfo.Phone,
							"Email": ServiceOrder.CustomerContactInfo.Email,
							"_Equipment": ServiceOrder._Equipment.SerialNumber,
							"_Product": ServiceOrder._Product.ProductName,
							"OpenDate": ServiceOrder.OpenDate,
							"ProblemTypeDescription": ServiceOrder.ProblemTypeDescription,
							"ProblemNotes": ServiceOrder.ProblemNotes,
							"CustomerContactInfo": ServiceOrder.CustomerContactInfo
							//"CurrentStatus": ServiceOrder.CurrentStatus
						});
						//console.log(myOrders);
					});
					callback();
				});
				
			},
			/*function(callback){
				Equipment.find()
				.where('_User').equals('48243')
				.select('_id SerialNumber ProductName NextPMDescription NextPMDate _Product')
				.populate('_Product')
				.exec(function (err, Equipment){
					Equipment.forEach(function(Equipment){
						myEquipment.push({
							"_id": Equipment.SerialNumber,
							"_Product": Equipment._Product.ProductName,
							"NextPMDescription": Equipment.NextPMDescription,
							"NextPMDate": Equipment.NextPMDate
						})
						//console.log(Equipment);
					});
					callback();
				});
				
			}*/
		], function(err){
			 res.render('engineer', 
					{ tabletitle: req.session.title, 
						reportdate: req.session.reportdate,
						header1: 'Service Order',
						header2: 'Equipment',
						header3: 'Product',
						header4: 'Date Requested',
						header5: 'Problem Type',
						header6: 'status',
						accepted: myOrders,
						header7: 'Equipment',
						header8: 'Product',
						header9: 'Maintenance',
						header10: 'Date Required',
						assigned: myAssigned,
						onsited: myOnsite
					})
				}
		);
	};
};