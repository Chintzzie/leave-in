var mongoose = require("mongoose");

var transactionSchema = mongoose.Schema({
    reason: String,
    data:{
        startdate: Date,
        isoneday: Boolean,
        isseveraldays: Boolean,
        enddate: Date,
        isperiods: Boolean,
        startperiod: Number,
        endperiod: Number,
        isproxytransaction: Boolean,  
        students:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    reftransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    forperiod: Number,
    fordate: Date,
    time : { type : Date, default: Date.now },
    acceptance: {type: Boolean, default: false},
    isrejected: {type: Boolean,default: false},
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    redirection: {type: Boolean,default: false},
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    interacceptance: {type: Boolean,default: false},
    isNotification: {type: Boolean,default: false},
    headinvolved: {type: Boolean,default: true}
});

module.exports = mongoose.model("Transaction", transactionSchema);