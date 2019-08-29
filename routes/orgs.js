var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Org = require("../models/org");
var Dept=require("../models/dept");
var middleware = require("../middleware");

//NEW- Create a new org
router.get("/orgs/new",middleware.isLoggedIn,function(req,res){
    //Request page
    res.render("orgs/new");
});

//Create- Create a new org
router.post("/orgs",middleware.isLoggedIn,function(req,res){
    var org={name: req.body.name,url: req.body.url,img: req.body.img,head: req.user._id};
    Org.create(org,function(err,neworg){
        res.redirect("/orgs");
    });
});

//INDEX- Show all orgs
router.get("/orgs",middleware.isLoggedIn,function(req,res){
    Org.find({},function(err,orgs){
        if(err){
            console.log(err);
        }else{
            res.render("orgs/index",{orgs: orgs});
        }
    });
});

//SHOW- list all departments in an org & show detailed info of an org
router.get("/orgs/:id/show",middleware.isLoggedIn,function(req,res){
    Org.findById(req.params.id).populate("head").exec(function(err,org){
        if(err){
            console.log(err);
        }else{
            res.render("orgs/show",{org: org});
        }
    });
});

//EDIT-edit depts in an org
router.get("/orgs/:id/newdept",middleware.isLoggedIn,function(req,res){
    res.render("orgs/newdept",{org_id: req.params.id});
});

//UPDATE- add new dept to an org
router.post("/orgs/:id/show",middleware.isLoggedIn,function(req,res){
    var newdept={name: req.body.name,head: req.body.head};
    Org.findByIdAndUpdate(req.params.id,{$push: {depts: newdept}},function(err,org){
        if(err){
            console.log(err);
        }else{
            User.findByIdAndUpdate(req.user._id,{org: req.params.id,dept: req.body.name},function(err,updateduser){
                if(err){
                    console.log(err);
                }else{
                    // console.log("Updated User-------");
                    // console.log(updateduser);
                    res.redirect("/orgs/"+req.params.id+"/show");
                }
            });
            
        }
    });
});

//Listing all admins of a dept
router.get("/orgs/:id/:deptname",middleware.isLoggedIn,function(req,res){
    var info={org: req.params.id,dept: req.params.deptname};
    Org.findById(req.params.id).populate("depts.head").exec(function(err,foundorg){
        if(err){
            console.log(err);
        }else{
            User.find({type: "admin",org: req.params.id,dept: req.params.deptname},function(err,foundusers){
                res.render("depts/show",{admins: foundusers,org: foundorg,deptname: req.params.deptname});
            });
        }
    });
        
    
});

//Updating admin association with org and dept
router.post("/admins/:id/register",middleware.isLoggedIn,function(req,res){
    console.log("------------------------------");
    // var info={org: req.body.org,dept: req.body.dept,user: req.params.id};
    // console.log(info);
    User.findByIdAndUpdate(req.params.id,{org: req.body.org,dept: req.body.dept},function(err,updateduser){
        if(err){
            console.log(err);
        }else{
            // console.log("Updated User-------");
            // console.log(updateduser);
            res.redirect("/orgs/"+req.body.org+"/"+req.body.dept);
        }
    });
});

module.exports = router;