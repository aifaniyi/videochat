/**
* User module
*/
/* import User entity*/
var User = require('../entity/user.js');

exports.create = function(newuser, callback) {

    console.log(newuser.email)
  User.find({email: newuser.email}, function(err, data){
    console.log(newuser.email)
    if (err){
      return callback(err);
    }

    /* if user does not exist, then create */
    if (data.email === null) {
      newuser.save(function(err, user){
        if (err) {
          return callback(err);
        }
        newuser.isauthenticated = true;
        return callback(newuser);
      })
    }
  });
}

exports.auth = function(req, res, callback) {
  var newuser = new User({
    username: req.body.username || req.body.email,
    email: req.body.email || req.body.username,
    password: req.body.password
  });
};
