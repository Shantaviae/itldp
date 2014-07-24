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
var moment = require('moment');


//Render customer service order details - Engineering Portal
 exports.details = function (req, res){
    var date = moment();

    if (!req.session.loggedIn){
        res.redirect('/login');
    }else {

        ServiceOrder.findOne({CloseDate: {$exists: false} })
        .where('_AssignedTo').equals(req.session.user._id)
        .where('_id').equals(req.query.id)
        .populate('_Product')
        .populate('_Equipment')
        .exec(function (err, order){
        	console.log("------------------------Test --------------------------");
        	console.log(order);
        	console.log("--------------------------------------------------------");
            res.render('modal1engineer.jade', 
                  { OrderDetails: order,
                    customerNames: req.session.user.CustomerName, 
                    Today123: date
                })
        });
    }
}; 


//Checkout render
 exports.checkoutModal = function (req, res){

  var myOrders = [];
  var myEquip = [];
  var myEquipment = [];
  var myServicetypes = [];
  var myPriorities = [];
  var myPmTypes = [];
  var myStatus = [];

  var date = moment();

  if (!req.session.loggedIn){
        res.redirect('/login');
    }else {

          async.parallel([
            function(callback){
                Status.find()
                .where('_id').lte(4)
                .exec(function (err, statustypes){
                    if(!err) {
                       statustypes.forEach(function(mystatus){
                            myStatus.push({
                                "_id": mystatus._id,
                                "StatusDescription": mystatus.StatusDescription
                            });
                        });
                    }else {
                        return callback(err);
                    }
                    callback();
                });
            },
            function(callback){
                PMType.find()
                .exec(function (err, pmtypes){
                    if(!err){
                        pmtypes.forEach(function(mypmtypes){
                            myPmTypes.push({
                                "_id": mypmtypes._id,
                                "PMDescription": mypmtypes.PMDescription
                            });
                         });
                    }else {
                        return callback(err);
                    }
                    callback();
                });
            },
            function(callback){
                 Priority.find()
                .exec(function (err, priorities){
                    if(!err){
                        priorities.forEach(function(mypriorities){
                            myPriorities.push({
                                "_id": mypriorities._id,
                                "PriorityDescription": mypriorities.PriorityDescription
                            });
                        });
                    }else {
                        return callback(err);
                    }
                    callback();
                    
                });
            }], function(err){
                        if (err) return next(err);
                        else {
                          res.render('modal2engineer.jade', 
                          { Orders: myOrders,
                            Equipment: myEquip,
                            title: "Check Out",
                            equipments: myEquipment,
                            statusTypes: myStatus,
                            pmTypes: myPmTypes,
                            priorities: myPriorities,
                            customerName: req.session.user.CustomerName, 
                            _id: req.query.orderID
                            })
                        }
                    }
            );
    }
}; 


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
				.where('CurrentStatus').ne('Assigned, Waiting to be Accepted')
				.where('CurrentStatus').ne('On-site')
				//.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus _Equipment _Product')
				.populate('_Product')
				.populate('_Equipment')
				.populate('_CreatedBy')
				.sort('PriorityDescription')
				.exec(function (err, ServiceOrder){
					ServiceOrder.forEach(function(ServiceOrder){
						myOrders.push({
							"_id": ServiceOrder._id,
							"CurrentStatus": ServiceOrder.CurrentStatus,
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
						console.log(ServiceOrder);
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
exports.Accept = function(req, res){ 
	console.log(req.body._id);
	ServiceOrder.findById( req.body._id )
	.exec(function (err, serviceorder){
		console.log(serviceorder)
        serviceorder.ServiceDetails.push({
        	_id: (serviceorder.ServiceDetails.length+1),
            _User: req.session.user._id,
            StatusDescription: "Accepted",
            AcceptedDate: req.body.Today
        });
        serviceorder.CurrentStatus = "Accepted";
        console.log(serviceorder)
        serviceorder.save(function (err, serviceorder){
        	res.redirect('/engineer')
        });
	});
};
exports.Checkin = function(req, res){ 
	
	ServiceOrder.findById( req.body._id )
	.exec(function (err, serviceorder){
		console.log(serviceorder)
        serviceorder.ServiceDetails.push({
        	_id: (serviceorder.ServiceDetails.length+1),
            _User: req.session.user._id,
            StatusDescription: "On-site",
            Checkin: req.body.Today
        });
        serviceorder.CurrentStatus = "On-site";
        console.log(serviceorder);
        serviceorder.save(function (err, serviceorder){
        	res.redirect('/engineer')
        });
	});
};
exports.Checkout = function(req, res){ 
	console.log(req.body);
	ServiceOrder.findById( req.body._id )
	.exec(function (err, serviceorder){
		//console.log(serviceorder)
      	var id = serviceorder.ServiceDetails.length-1;
      	console.log(id);
      	//console.log(serviceorder.ServiceDetails[1])
        serviceorder.ServiceDetails[id].StatusDescription = req.body.StatusDescription;
        serviceorder.ServiceDetails[id].ActionNotes = req.body.ActionNotes;
        serviceorder.ServiceDetails[id].Checkout = req.body.Today;
        serviceorder.ServiceDetails[id].ActualMinutes = moment(serviceorder.ServiceDetails[id].Checkin).diff(req.body.Today, 'minutes')
        serviceorder.CurrentStatus = req.body.StatusDescription;
        if (serviceorder.CurrentStatus == "Completed") {
            serviceorder.CloseDate = req.body.Today;
        }
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk    " +moment(serviceorder.ServiceDetails[id].Checkin).diff(req.body.Today, 'minutes'));
        serviceorder.save(function (err, serviceorder){
            if(!err){
        	res.redirect('/engineer')
                
            } else{
                console.log('siloadfsiadubfioudsbfoiuabsf    '+err);
            }
        });
	});
};