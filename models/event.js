var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
    name: String,
    organizers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    org:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Org"
    },
    startdate: Date,
    isoneday: {type: Boolean,default: false},
    isseveraldays: {type: Boolean,default: false},
    enddate: Date,
    isperiods: {type: Boolean,default: false},
    startperiod: Number,
    endperiod: Number
});

module.exports = mongoose.model("Event", EventSchema);