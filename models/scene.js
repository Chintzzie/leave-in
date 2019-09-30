var mongoose = require("mongoose");

var SceneSchema = new mongoose.Schema({
    name: String,
    organizers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    org:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Org"
    },
    throughout_org:{type: Boolean,default: false},
    dept: String,
    startdate: Date,
    isoneday: Boolean,
    isseveraldays: Boolean,
    enddate: Date,
    isperiods: Boolean,
    startperiod: Number,
    endperiod: Number
});

module.exports = mongoose.model("Scene", SceneSchema);