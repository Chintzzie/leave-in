var mongoose = require("mongoose");

var DeptSchema = new mongoose.Schema({
    name: String,
    head:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Dept", DeptSchema);