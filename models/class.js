var mongoose = require("mongoose");

var ClassSchema = new mongoose.Schema({
    name: String,
    head:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    org:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Org"
    },
    dept: String,
    faculty: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    timetable: [
        {
            lecturers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"User"
                }
            ]
        }
    ]
});

module.exports = mongoose.model("Class", ClassSchema);