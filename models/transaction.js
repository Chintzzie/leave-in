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
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);