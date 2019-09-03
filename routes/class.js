var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Transaction = require("../models/transaction");
var Class = require("../models/class");
var middleware = require("../middleware");

//NEW-FORM for a new class
router.get("/:orgid/:dept/classes/new",middleware.isLoggedIn,function(req,res){
    User.find({type: "admin",org: req.params.orgid,dept: req.params.dept},function(err,foundusers){
        res.render("classes/new",{orgid: req.params.orgid,dept: req.params.dept,admins: foundusers,nos: req.query.nos});
    });
});

//CREATE - create a new class
router.post("/:orgid/:dept/classes",middleware.isLoggedIn,function(req,res){

    
    var newClass={name: req.body.name,head: req.body.head,faculty: req.body.faculty,org: req.params.orgid,dept: req.params.dept};
    // res.send("Ok from creation");
    Class.create(newClass,function(err,createdClass){
        if(err){
            console.log(err);
        }else{
            // console.log(createdClass);
            // res.send("Ok from Createdclass");
            res.redirect("/"+req.params.orgid+"/"+req.params.dept+"/classes/"+createdClass._id+"/timetable");
            // res.redirect("/"+req.params.orgid+"/"+req.params.dept+"/classes");
        }
    });
});
 
//INDEX-Show all classes
router.get("/:orgid/:dept/classes",middleware.isLoggedIn,function(req,res){
    Class.find({org:req.params.orgid,dept: req.params.dept}).populate("faculty").populate("head").populate("org").exec(function(err,foundClasses){
        // console.log("classes found");
        // console.log(foundClasses);
        // res.send("Ok from class index");
        res.render("classes/index",{classes: foundClasses,orgid: req.params.orgid,dept: req.params.dept});
    });
});

//SHOW-Show info of a class
router.get("/:orgid/:dept/classes/:classid",middleware.isLoggedIn,function(req,res){
    Class.findById(req.params.classid).populate("faculty").populate("head").populate("org").populate("org.depts").populate("org.depts.head").exec(function(err,foundClass){
        res.render("classes/show",{classs: foundClass});
    });
});

//EDIT-edit form for class
router.get("/:orgid/:dept/classes/:classid/edit",middleware.isLoggedIn,function(req,res){
    Class.findById(req.params.classid,function(err,foundClass){
        User.find({type: "admin",org: req.params.orgid,dept: req.params.dept},function(err,foundusers){
            //  console.log(foundClass);
            res.render("classes/edit",{orgid: req.params.orgid,dept: req.params.dept,admins: foundusers,classs: foundClass});
        });
    });
    
});

//UPDATE- update class details
router.post("/:orgid/:dept/classes/:classid",middleware.isLoggedIn,function(req,res){
    var newClass={name: req.body.name,head: req.body.head,faculty: req.body.faculty};
    Class.findByIdAndUpdate(req.params.classid,newClass,function(err,foundClass){
        res.redirect("/"+req.params.orgid+"/"+req.params.dept+"/classes/"+req.params.classid);
    });
    
});

//NEW TIMETABLE - NEW form  for timetable of a class
router.get("/:orgid/:dept/classes/:classid/timetable",middleware.isLoggedIn,function(req,res){
    var nop=req.query.nop;
    Class.findById(req.params.classid).populate("timetable").populate("faculty").populate("timetable.lecturers").exec(function(err,foundclass){
            res.render("classes/timetables/new",{classs: foundclass,nop: nop});
    });
});

//CREATE TIMETABLE 
router.post("/:orgid/:dept/classes/:classid/timetable",middleware.isLoggedIn,function(req,res){
    // console.log("-----------------");
    // console.log(req.body.timetable);
    // req.body.timetable.forEach(function(table){
    //     console.log(table.lecturers);
    //     console.log("++++++");
    // });
    Class.findByIdAndUpdate(req.params.classid,{timetable: req.body.timetable},function(err,updatedclass){
        // console.log(updatedclass);
        // console.log("--------------");
        // updatedclass.timetable.forEach(function(table){
        //         console.log(table.lecturers);
        //         console.log("++++++");
        //     });
        res.redirect("/"+req.params.orgid+"/"+req.params.dept+"/classes/"+req.params.classid);
    });

});

//EDIT/SHOW TIMETABLE
router.get("/:orgid/:dept/classes/:classid/timetable/edit",middleware.isLoggedIn,function(req,res){
    var nop=req.query.nop;
    Class.findById(req.params.classid).populate("timetable").populate("faculty").exec(function(err,foundclass){
        // console.log("From routes.js");
        // foundclass.timetable.forEach(function(table){
        //              console.log(table.lecturers);
        //              console.log("++++++");
        //      });  
        res.render("classes/timetables/edit",{classs: foundclass,nop: nop});
    });
});



module.exports = router;