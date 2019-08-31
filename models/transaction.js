var mongoose = require("mongoose");

var transactionSchema = mongoose.Schema({
    reason: String,
    acceptance: {type: Boolean, default: false},
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
    interacceptance: {type: Boolean,default: false}
});

module.exports = mongoose.model("Transaction", transactionSchema);