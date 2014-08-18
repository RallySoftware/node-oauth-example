var router = require('express').Router();
var request = require('request');

router.get('/test-token', function(req, res){
  if(req.session.testInProgress){
    return;
  }
  req.session.testInProgress = true;

  var testTokenAgainstRally = function(){
    request.get({
      url: 'https://rally1.rallydev.com/login/key/' + req.user.accessToken + '.js'
    }, function(err, response, body){
      console.log("Response from Rally:");
      console.log("StatusCode:", response.statusCode);
      console.log("Time:", response.headers.date);
      console.log("\n");
    });

  };

  var testTokenAgainstZuul = function(){
    request.get({
      url: 'https://rally1.rallydev.com/slm/webservice/v3.0/user',
      headers: {
        zsessionid: req.user.accessToken
      }
    }, function(err, response, body){
      console.log("Response from Zuul:");
      console.log("StatusCode:", response.statusCode);
      console.log("Time:", response.headers.date);
      console.log("\n");
    });
  };

  setInterval(function(){
    testTokenAgainstRally();
    testTokenAgainstZuul();
  }, 60*1000);

  testTokenAgainstRally();
  testTokenAgainstZuul();

  res.send('test in progress, see console for output.');

});

module.exports = router;
