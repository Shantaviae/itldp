
/*
 * GET home page.
 */
exports.displayform = function(req, res){

// display form
  res.render('contactus.jade', { title: 'Contact Us'});
};

exports.echodata = function(req, res){

// Process form data after submission
  res.render('echodata.jade', { title: 'Submission successful',
                                question: req.body.question,
                                work: req.body.work,
                                position: req.body.position,
                                names: req.body.names,
                                address1: req.body.address1,
                                address2: req.body.address2,
                                city: req.body.city,
                                state: req.body.state,
                                zip: req.body.zip,
                                email: req.body.email,
  });
};