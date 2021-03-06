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


//Render customer service order details - Customer Portal
 exports.details = function (req, res){
    var date = moment();

    if (!req.session.loggedIn){
        res.redirect('/login');
    }else {

        ServiceOrder.findOne({CloseDate: {$exists: false} })
        .where('_CreatedBy').equals(req.session.user._id)
        .where('_id').equals(req.query.id)
        .populate('_Product')
        .populate('_Equipment')
        .exec(function (err, order){
            res.render('modal1.jade', 
                  { OrderDetails: order,
                    customerNames: req.session.user.CustomerName, 
                    Today123: date
                })
        });
    }
}; 


//Render customer service order details
 exports.neworder = function (req, res){

  var myOrders = [];
  var myEquip = [];
  var myEquipment = [];
  var myServicetypes = [];
  var myPriorities = [];
  var myPmTypes = [];

  var date = moment();

  if (!req.session.loggedIn){
        res.redirect('/login');
    }else {

          async.parallel([
              function(callback){
                ServiceOrder.find({CloseDate: {$exists: false} })
                .where('_CreatedBy').equals(req.session.user._id )
                .populate('_Product')
                .populate('_Equipment')
                .exec(function (err, orders){
                  if (err){
                    return callback(err);
                  }
                    orders.forEach(function(orders){
                      myOrders.push(orders);
                    });
                    callback();
                });
              },
              function(callback){
                Equipment.find({ _User: req.session.user._id })
                    .populate('_Product')
                    .sort('NextPMDate')
                    .exec(function (err, equipment){
                      if (!err){
                        equipment.forEach(function(equipment){
                          myEquip.push(equipment);
                          });
                      }else {
                            return callback(err);
                      }
                        callback();
                    });
                },
                function(callback){
                Equipment.find({ _User: req.session.user._id })
                .populate('_Product')
                .sort('_Product')
                .exec(function (err, equipment){
                    if(!err) {
                        equipment.forEach(function(myequip){
                            if (myequip.SerialNumber == req.query.serial){
                                myEquipment.push({
                                    "_id": myequip._id,
                                    "SerialNumber": myequip.SerialNumber,
                                    "ProductName": myequip._Product.ProductName,
                                    "Room": myequip.Room,
                                    "ProductID": myequip._Product._id
                                });
                            }
                        });
                    }else {
                        return callback(err);
                    }
                    callback();
                });
            },
            function(callback){
                ProblemType.find()
                .exec(function (err, problemtypes){
                    if(!err) {
                        problemtypes.forEach(function(myproblemtypes){
                            myServicetypes.push({
                                "_id": myproblemtypes._id,
                                "ProblemTypeDescription": myproblemtypes.ProblemTypeDescription
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
                          res.render('modal2.jade', 
                          { Orders: myOrders,
                            Equipment: myEquip,
                            title: "Create a New Service Request",
                            equipments: myEquipment,
                            serviceTypes: myServicetypes,
                            pmTypes: myPmTypes,
                            priorities: myPriorities,
                            customerName: req.session.user.CustomerName, 
                            Today: date})
                        }
                    }
            );
    }
}; 

//Populate open service request and equipment data for customer portal
exports.portal = function(req, res){

  var myOrders = [];
  var myEquip = [];
  var myEquipment = [];
  var myServicetypes = [];
  var myPriorities = [];
  var myPmTypes = [];

  var date = moment();

  if (!req.session.loggedIn){
        res.redirect('/login');
    }else {

          async.parallel([
              function(callback){
                ServiceOrder.find({CloseDate: {$exists: false} })
                .where('_CreatedBy').equals(req.session.user._id )
                .populate('_Product')
                .populate('_Equipment')
                .exec(function (err, orders){
                  if (err){
                    return callback(err);
                  }
                    orders.forEach(function(orders){
                      myOrders.push(orders);
                    });
                    callback();
                });
              },
              function(callback){
                Equipment.find({ _User: req.session.user._id })
                    .populate('_Product')
                    .sort('NextPMDate')
                    .exec(function (err, equipment){
                      if (!err){
                        equipment.forEach(function(equipment){
                          myEquip.push(equipment);
                          });
                      }else {
                            return callback(err);
                      }
                        callback();
                    });
                },
                function(callback){
                Equipment.find({ _User: req.session.user._id })
                .populate('_Product')
                .sort('_Product')
                .exec(function (err, equipment){
                    if(!err) {
                        equipment.forEach(function(myequip){
                            myEquipment.push({
                                "_id": myequip._id,
                                "SerialNumber": myequip.SerialNumber,
                                "ProductName": myequip._Product.ProductName,
                                "Room": myequip.Room,
                                "ProductID": myequip._Product._id
                            });
                        });
                    }else {
                        return callback(err);
                    }
                    callback();
                });
            },
            function(callback){
                ProblemType.find()
                .exec(function (err, problemtypes){
                    if(!err) {
                        problemtypes.forEach(function(myproblemtypes){
                            myServicetypes.push({
                                "_id": myproblemtypes._id,
                                "ProblemTypeDescription": myproblemtypes.ProblemTypeDescription
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
                          res.render('customer.jade', 
                          { Orders: myOrders,
                            Equipment: myEquip,
                            title: "Create a New Service Request",
                            equipments: myEquipment,
                            serviceTypes: myServicetypes,
                            pmTypes: myPmTypes,
                            priorities: myPriorities,
                            customerName: req.session.user.CustomerName, 
                            Today: date})
                        }
                    }
            );
    }
}; 

//Create service request
exports.create = function(req, res){
    var myEquipment = [];
    var myServicetypes = [];
    var myPriorities = [];
    var myPmTypes = [];

    if (!req.session.loggedIn){
        res.redirect('/login');
    }else {
        async.parallel([
            function(callback){
                Equipment.find({ _User: req.session.user._id })
                .populate('_Product')
                .sort('_Product')
                .exec(function (err, equipment){
                    if(!err) {
                        equipment.forEach(function(myequip){
                            myEquipment.push({
                                "_id": myequip._id,
                                "SerialNumber": myequip.SerialNumber,
                                "ProductName": myequip._Product.ProductName,
                                "Room": myequip.Room,
                                "ProductID": myequip._Product._id
                            });
                        });
                    }else {
                        return callback(err);
                    }
                    callback();
                });
            },
            function(callback){
                ProblemType.find()
                .exec(function (err, problemtypes){
                    if(!err) {
                        problemtypes.forEach(function(myproblemtypes){
                            myServicetypes.push({
                                "_id": myproblemtypes._id,
                                "ProblemTypeDescription": myproblemtypes.ProblemTypeDescription
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
                    res.render('service-create', {
                        title: "Create a New Service Request",
                        equipments: myEquipment,
                        serviceTypes: myServicetypes,
                        pmTypes: myPmTypes,
                        priorities: myPriorities,
                        customerName: req.session.user.CustomerName
                    });
                }
        );
    }
};

exports.doCreate = function(req, res) {
    var maxId;
    if (!req.session.loggedIn){
        res.redirect('/login');
    }else {
        console.log("OK Here is what Equipment is looking like:  " + req.body.Equipment);
        EquipObj = JSON.parse(req.body.Equipment);
        console.log("Here it is in Pieces, equipid:   "   + EquipObj.equipid);
        console.log("Here it is in Pieces, prodid:   "   + EquipObj.prodid);
        async.series([
            function(callback) {
                ServiceOrder.aggregate( { $group: { _id: "", mymaxid: { $max: "$_id"} } } )
                .exec(function (err, mymax){
                    if(!err){
                        var max = mymax[0];
                        maxId = (max.mymaxid + 1);
                        callback();
                    }
                    else{
                        console.log(err);
                        return callback(err);
                    }
                });
            },
            function(callback) {
                console.log("I'm here Trying to Cerate the Service Order");
                if(req.body.PMType == null){
                    console.log("I'm in the if");
                    ServiceOrder.create({
                        _id: maxId,
                        _CreatedBy: req.session.user._id,
                        ProblemTypeDescription: req.body.ProblemType,
                        PriorityDescription: req.body.Priority,
                        ProblemNotes: req.body.ProblemNotes,
                        OpenDate: req.body.Today,
                        CurrentStatus: "Submitted By Customer",
                        CustomerContactInfo: {
                            Name: req.body.ContactName,
                            Phone: req.body.ContactPhone,
                            Email: req.body.ContactEmail
                        },
                        _Equipment: EquipObj.equipid,
                        _Product: EquipObj.prodid
                    }, function (err, serviceorder) {
                        if(!err){
                            console.log("New Serice Order created:  " + serviceorder)
                            callback();
                        }else{
                            console.log(err);
                            return callback(err);
                        }
                    });
                }else {
                    console.log("I'm in the else");
                    ServiceOrder.create({
                        _id: maxId,
                        _CreatedBy: req.session.user._id,
                        ProblemTypeDescription: req.body.ProblemType,
                        PriorityDescription: req.body.Priority,
                        ProblemNotes: req.body.ProblemNotes,
                        PMDescription: req.body.PMType, // This one line is why I have two create options, one if PM, one if not.
                        OpenDate: req.body.Today,
                        CurrentStatus: "Submitted By Customer",
                        CustomerContactInfo: {
                            Name: req.body.ContactName,
                            Phone: req.body.ContactPhone,
                            Email: req.body.ContactEmail
                        },
                        _Equipment: EquipObj.equipid, ///// Not gettig these correctly!!!!
                        _Product: EquipObj.prodid
                    }, function (err, serviceorder) {
                        if(!err){
                            console.log("New Serice Order created:  " + serviceorder)
                            callback();
                        }else {
                            console.log(err);
                            return callback(err);
                        }
                    });
                }
            },
            function(callback){
                ServiceOrder.findById( maxId )
                .exec(function (err, serviceorder){
                    if(!err){
                        serviceorder.ServiceDetails.push({
                            _id: 1,
                            _User: req.session.user._id,
                            StatusDescription: "Submitted By Customer"
                        });
                        serviceorder.save(function (err, serviceorder){
                            if(!err){
                                callback();
                            }else {
                                return callback(err);
                            }
                        });
                    }else {
                        return callback(err);
                    }
                });
            }
        ], function (err){
            if (err) return next(err);
            res.redirect('/customer?serviceid=' + maxId);
        });
    }
};













