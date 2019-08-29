var mongoose = require("mongoose");

var OrgSchema = new mongoose.Schema({
    name: String,
    url: String,
    img: String,
    head:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    depts:[
        {
            name: String,
            head:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ]
});

module.exports = mongoose.model("Org", OrgSchema);