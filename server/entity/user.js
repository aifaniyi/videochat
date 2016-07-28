var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isauthenticated: Boolean,
    created: Date,
    modified: Date
});

UserSchema.pre('save', function(next) {
    var user = this, currentDate = new Date();;
    user.modified = currentDate;
    if (!user.created) user.created = currentDate;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user', UserSchema, 'user');
