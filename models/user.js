var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    firstname:String,
    lastname: String,
    useremail:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
        unique:true,
    },
    password:String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);