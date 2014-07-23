
/*
 * GET home page.
 */

/*exports.hellofun = function(req, res){

// Lets create an array and load it with User Data
  var myArray = [];
  myArray.push({
 		  target: "Blah de blah blah blah de de blah",
  		progress: "Developmental activity in science"});
  myArray.push({
      target: "Blah de blah blah blah de de blah",
      progress: "Developmental activity in science"});
  myArray.push({
      target: "Blah de blah blah blah de de blah",
      progress: "Developmental activity in science"});
 
 // Lets put data into the Session object	
  m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

  d = new Date();
  curr_day = d.getDate();
  curr_month = d.getMonth();
  curr_year = d.getFullYear();
  req.session.reportdate =  curr_day + "-" + m_names[curr_month] + "-" + curr_year;                 

  res.render('hi.jade', 
  			{ reportdate: req.session.reportdate,
  			  header1: 'Target',
  			  header2: 'Progress as of Year End 2012',
  			  descriptions:  myArray})
};*/

var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Equipment = mongoose.model('Equipment');
var ServiceOrder = mongoose.model('ServiceOrder');
var _ = require('underscore');
var async = require('async');


exports.hellofun = function(req, res){

  var myOrders = [];
  var myEquip = [];

  async.parallel([
      function(callback){
        ServiceOrder.find({CloseDate: {$exists: false} })
        .where('_CreatedBy').equals(48243)
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
        Equipment.find({ _User: 48243 })
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
        }], function(err){
                if (err) return next(err);
                else {
                  res.render('hi.jade', 
                  { Orders: myOrders,
                    Equipment: myEquip})
                }
            }
    );
}; 