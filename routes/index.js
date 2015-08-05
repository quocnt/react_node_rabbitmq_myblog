var express  = require('express');
var passport = require('passport');
var User     = require('../models/user');
var router   = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.user ? req.user.export() : null;
  console.log(user);
  res.render('index', { title: 'Express' , user: user });
});

router.get('/register', function(req, res) {
  res.render('register');
}); 

router.post('/register', function(req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (err) {
      return res.status(400).send({err: err});
    }

    passport.authenticate('local')(req, res, function() {
      return res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
