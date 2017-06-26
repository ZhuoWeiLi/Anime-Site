const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema);