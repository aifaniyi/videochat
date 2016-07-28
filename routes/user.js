var express = require('express');
var router = express.Router();

var user = require('../server/modules/user.js');
var User = require('../server/entity/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    if (err){
      return;
    }
    res.send(users);
  });
});

router.post('/', function(req, res, next) {
  var newuser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  user.create(newuser, function(err, data){
    if (err) {
      return err;
    }
    res.send(data);
  });
});

module.exports = router;
