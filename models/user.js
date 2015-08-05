var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: String
});

// passportLocalMongoose module will handle username/password for this model
// https://github.com/saintedlama/passport-local-mongoose
User.plugin(passportLocalMongoose);

User.methods.export = function() {
  var user = this.toObject();
  delete user.hash;
  return user;
};

module.exports = mongoose.model('User', User);