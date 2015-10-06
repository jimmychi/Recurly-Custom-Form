
// API usage Dependencies
var Recurly = require('node-recurly');
var express = require('express');
var bodyParser = require('body-parser');

// We'll use uuids to generate account_code values
var uuid = require('node-uuid');

// Set up express
var app = express();

//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var urlencode = require('urlencode');
var json = require('json-middleware');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use('/api/subscriptions/new', multipartMiddleware);


// Instantiate a configured recurly client
var recurly = new Recurly({
  SUBDOMAIN: 'purebox-2',
  API_KEY: '5c1f6c37157b4e7ea3cf87f1e9c1a23c'
});

// POST route to handle a new subscription form
app.post('/api/subscriptions/new', function (req, res) {


  // Create the scubscription using minimal
  // information: plan_code, currency, account_code, and
  // the token we generated on the frontend

  recurly.subscriptions.create({

    plan_code: '3month',
    currency: 'USD',
    account: {
      account_code: uuid.v1(),
      billing_info: {
        token_id: req.body['recurly-token']
      },
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  }, function (err, response) {
    if (err) {
      var message = parseErrors(err.data);
      console.log("data: " + err.data);
      //return res.redirect('ERROR_URL?error is=' + message + " here");
    }

    // Otherwise redirect to a confirmation page
    res.redirect('/');
  });
  //console.log(JSON.stringify(req.body));

});

// POST route to handle a new account form
app.post('/api/accounts/new', function (req, res) {
  recurly.accounts.create({
    account_code: uuid.v1(),
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, redirect);
});

// PUT route to handle an account update form
app.put('/api/accounts/:account_code', function (req, res) {
  recurly.accounts.update(req.params.account_code, {
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, redirect);
});

// Mounts express.static to render example forms
app.use(express.static(__dirname + '/../../public'));

// Start the server
app.listen(9001, function () {
  console.log('Listening on port 9001');
});


/* Start the server */
/*
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
*/

// A set of utility functions for redirecting and parsing API errors
function redirect (err, response) {
  if (err) return res.redirect('ERROR_URL?error=' + parseErrors(err.data));
  res.redirect('SUCCESS_URL');
}

function parseErrors (data) {

  return data.errors
    ? data.errors.error.map(parseValidationErrors).join(', ')
    : [data.error.symbol, data.error.description].join(': ');

}

function parseValidationErrors (e) {
  return [e.$.field, e._].join(' ');
}
