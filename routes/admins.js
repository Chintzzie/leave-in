var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Transaction = require("../models/transaction");
var middleware = require("../middleware");


//INDEX - show all admins
router.get("/admins/index", function(req, res){
    // Get all admins from DB
    User.find({type: "admin"}, function(err, allAdmins){
       if(err){
           console.log(err);
       } else {
          res.render("admins/index",{admins: allAdmins});
       }
    });
});

//NEW-Request an admin
router.get("/:id/transaction/new",middleware.isLoggedIn,function(req,res){
    //Request page
    var adminid=req.params.id;
    if(req.user!=null){
        res.render("transactions/new",{adminid: adminid});
    } else{
        res.redirect("/login");
    }
});

//CREATE -add new transaction
router.post("/transactions",middleware.isLoggedIn,function(req,res){
    User.find({username: req.body.adminid},function(err,adminresponder){
        if(err){
            console.log(err);
        } else {
            var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid};
            // console.log("About to be created===");
            // console.log(transaction);
            Transaction.create(transaction,function(err,newtransact){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    // console.log("Newly created====");
                    // console.log(newtransact);
                    res.redirect("/transactions");
                }
            });
        }
     });
});

//INDEX - show all transactions
router.get("/transactions",middleware.isLoggedIn,function(req, res){
    // Get all transactions from DB
    if(req.user.type=="admin"){
        Transaction.find({responder:req.user._id}).populate("requester").populate("responder").exec(function(err, allTransactions){
            if(err){
                console.log("Error!");
            } else {
                console.log("Extracted");
                console.log(allTransactions);
                // res.send("OK!");
                res.render("transactions/index",{allTransactions: allTransactions});
            }
            });
    }else{
        Transaction.find({requester:req.user._id}).populate("requester").populate("responder").exec(function(err, allTransactions){
            if(err){
                console.log("Error!");
            } else {
                console.log("Extracted");
                console.log(allTransactions);
                // res.send("OK!");
                res.render("transactions/index",{allTransactions: allTransactions});
            }
            });
        }
});

//SHOW - show detailed info of a transaction
router.get("/transactions/:id/show",middleware.isLoggedIn,function(req,res){
    Transaction.findById(req.params.id).populate("requester").populate("responder").exec(function(err,transaction){
        if(err){
            console.log(err);
        }else{
            res.render("transactions/show",{transaction: transaction});
        }
    });
});

//SHOW - show detailed info of a transaction
router.post("/transactions/:id",middleware.isLoggedIn,function(req,res){
    Transaction.findByIdAndUpdate(req.params.id,{acceptance: true},function(err,transaction){
        res.redirect("/transactions/"+req.params.id+"/show");
    });
});

module.exports = router;