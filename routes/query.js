var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Equipment = mongoose.model('Equipment');
var ServiceOrder = mongoose.model('ServiceOrder');
var _ = require('underscore');
var async = require('async');

// Display all Product documents that are associated with the Modality 
//‘Sterilization’.  Sort the output by ProductName in ascending sequence.

exports.query1 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 1  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    Product.find()
      .where('Modality').equals('Sterilization')
      .sort('ProductName')
      .exec(function (err, products){
         products.forEach(function(products){
         console.log("ID: " + products._id + 
          "\nProductName: " + products.ProductName + 
          "\nProductPrice: " + products.ProductPrice + 
          "\nProductCost: " + products.ProductCost + "\n");
         });
      });
};

exports.queryUsers = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 1  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    User.find()
      .exec(function (err, users){
         users.forEach(function(users){
         console.log(users);
         });
      });
};



// Display the ServiceOrder document associated with _id (719762).  
//In the output, display these fields: _id, ProblemTypeDescription, 
//PriorityDescription, OpenDate, CloseDate, ReplacementParts (all fields).

exports.query2 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 2  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    ServiceOrder.findOne({ _id: 719762} )  
    .exec(function (err, order){
       console.log("ID: " + order._id + 
        "\nProblemTypeDescription: " + order.ProblemTypeDescription +
        "\nPriorityDescription: " + order.PriorityDescription + 
        "\nOpenDate: " + order.OpenDate +
        "\nCloseDate: " + order.CloseDate + 
        "\nReplacementParts: " + order.ReplacementParts);
       });
};


// Display the first ServiceOrder found in the database where:
//        CreatedBy user is 48243.
//        PriorityDescription is “High”
//        CurrentStatus is “Completed”. 
// Display all document fields.
exports.query3 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 3  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    ServiceOrder.findOne()
      .where('_CreatedBy').equals(48243)
      .where('PriorityDescription').equals('High')
      .where('CurrentStatus').equals('Completed')
      .exec(function (err, order){
       console.log("ID: " + order._id + 
        "\nCreatedBy: " + order._CreatedBy +
        "\nAssignedTo: " + order._AssignedTo + 
        "\nProblemTypeDescription: " + order.ProblemTypeDescription +
        "\nPriorityDescription: " + order.PriorityDescription + 
        "\nOpenDate: " + order.OpenDate +
        "\nCloseDate: " + order.CloseDate + 
        "\nCurrentStatus: " + order.CurrentStatus +
        "\nTotalEstimatedMinutes: " + order.TotalEstimatedMinutes + 
        "\nProblemNotes: " + order.ProblemNotes +
        "\nPMDescription: " + order.PMDescription + 
        "\nLaborCost: " + order.LaborCost +
        "\nPartCost: " + order.PartCost +
        "\nCustomerContactInfo: " + order.CustomerContactInfo + 
        "\nEquipment: " + order._Equipment +
        "\nProduct: " + order._Product + 
        "\nServiceDetails: " + order.ServiceDetails +
        "\nReplacementParts: " + order.ReplacementParts);
      });
};


// find and populate closed service orders
exports.query4 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 4  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    ServiceOrder.find({CloseDate: {$exists: true} })
      .where('_Equipment').equals(95179)
      .where('_CreatedBy').equals(48243)
      .populate('_Equipment')
      .sort('-CurrentStatus')
      .exec(function (err, orders){
         orders.forEach(function(orders){
         console.log(orders + "\n");
         });
      });
};


// parallel processing using async - find open service orders by user 48243

exports.query5 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 5  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================\n");     
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
            console.log("========================= Open Requests =================================");
            orders.forEach(function(orders){
              console.log("_id: "+ orders._id +
                    "\nSerialNumber: " + orders._Equipment.SerialNumber+
                    "\nOpenDate: " + orders.OpenDate +
                    "\nProblemTypeDescription: " + orders.ProblemTypeDescription +
                    "\nProductName: " + orders._Product.ProductName +
                    "\nCurrentStatus: " + orders.CurrentStatus + "\n");
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
                console.log("========================= Next PM =================================");
                equipment.forEach(function(equipment){
                  console.log("_id: "+ equipment._id +
                    "\nSerialNumber: " + equipment.SerialNumber+
                    "\nProductName: " + equipment._Product.ProductName +
                    "\nNextPMDescription: " + equipment.NextPMDescription +
                    "\nNextPMDate: " + equipment.NextPMDate + "\n");
                  });
              }else {
                    return callback(err);
              }
                callback();
            });
        }], function(err){
                if (err) return next(err);
            }
    );
}; 

// Update User 48243 position field to “Head Nurse”.  
exports.query6 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 6  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
    User.findOne({_id : 48243})
      .exec(function (err, user){
         if(!err){
            console.log("Current User Instance" + 
              "\nID: " + user._id + 
              "\nFirst Name: " + user.FirstName +
              "\nLast Name: " + user.LastName + 
              "\nPosition: " + user.Position);

            user.Position = "Head Nurse";

            user.save(function(err,user){
                console.log("\nUpdated User Instance" + 
                  "\nID: " + user._id + 
                  "\nFirst Name: " + user.FirstName +
                  "\nLast Name: " + user.LastName + 
                  "\nPosition: " + user.Position);
            });
         }
      });
};


// Update Product 69 by Pushing a new Component Subdocument into it.
exports.query7 = function(req, res){
      console.log("=========================================================================");   
      console.log("==========================             ==================================");  
      console.log("==========================  Problem 7  ==================================");
      console.log("==========================             =================================="); 
      console.log("=========================================================================");     
      Product.findOne( { _id: 69 } )
        .exec(function (err, product) {
            if(!err) {
                product.Components.push({
                    ComponentPrice: 1000,
                    CompontentDescription: "Super Component",
                    CompontentPartNumber: "AAABBBCCC", 
                    });
                product.save(function (err, product){
                    if(err){
                      console.log('The Save Operation has failed: ', err);
                    } else {
                      console.log(product);
                    }
                });
            }
        });
};