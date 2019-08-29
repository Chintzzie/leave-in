var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Org = require("../models/org");
var middleware = require("../middleware");

//SHOW - showing the current users profile
router.get("/users/:id",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.id).populate("org").exec(function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("users/show",{user: foundUser});
        }
    });
});

//EDIT -edit the user profile
router.get("/users/:id/edit",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.id).populate("org").exec(function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("users/edit",{user: foundUser});
        }
    });
});

//UPDATE-update user profile with new details
router.post("/users/:id",middleware.isLoggedIn,function(req,res){
    User.findByIdAndUpdate(req.params.id,req.body,function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            // console.log(req.body);
            // res.send("Updated user!");
            res.render("users/show",{user: foundUser});
        }
    });
});

//FLUSH-flush details of org and dept in an user
router.post("/users/:id/flush",middleware.isLoggedIn,function(req,res){
    User.findByIdAndUpdate(req.params.id,{org: undefined,dept: null},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            console.log(req.body);
            // res.send("Updated user!");
            req.flash("success", "Deregistered successfully! Register to any organization now!");
            res.redirect("/orgs");

        }
    });
});

module.exports = router;