var router = require('express').Router();
var passport = require('passport');
var request = require('request');

router.get('/', function(req, res) {
  res.status(200).render('index', {
    user: req.user
  });
});

router.get('/login/oauth/rally',
  passport.authenticate('rally')
);

router.get('/rally-callback',
  passport.authenticate('rally'),
  function(req, res){
    res.redirect('/');
  }
);

router.post('/login/oauth/rally/refresh', function (req, res, next) {
  request({
    method: 'POST',
    url: 'https://rally1.rallydev.com/login/oauth2/token',
    jar: false,
    form: {
      refresh_token: req.user.refreshToken,
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.SERVER_URL + '/rally-callback'
    }
  }, function (err, response, body) {
    body = JSON.parse(body);
    req.user.accessToken = body.access_token;
    req.user.refreshToken = body.refresh_token;

    res.status(200).send(req.user);
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
