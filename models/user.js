var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String,unique: true},
    password: String,
    type: String,
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org"
    },
    dept: String,
    classs:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);