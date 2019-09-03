var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Transaction = require("../models/transaction");
var middleware = require("../middleware");

//NEW-Request an admin
router.get("/:id/transaction/:head/new",middleware.isLoggedIn,function(req,res){
    //Request page
    // var ids={head: req.params.head};
    // console.log(ids);
    var adminid=req.params.id;
    if(req.user._id.equals(adminid)){
        req.flash("error","u cant post a request to yourself");
        res.redirect("back");
    }
    res.render("transactions/new",{adminid: adminid,head: req.params.head});
});

//CREATE -add new transaction
router.post("/transactions",middleware.isLoggedIn,function(req,res){
    // console.log("redirect value=====");
    // console.log(req.body.redirect);
    if(req.body.redirect!=null && req.body.redirect=="true"){
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid,redirection: true,head: req.body.head};
    }else if(req.body.redirect!=null && req.body.redirect=="false"){
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid,headinvolved: false};
    }
    else{
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid};
    }
    
    // console.log("About to be created===");
    // console.log(transaction);
    // res.send("OK!");
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
});

//INDEX - show all transactions
router.get("/transactions",middleware.isLoggedIn,function(req, res){
    // Get all transactions from DB
    if(req.user.type=="admin"){
        Transaction.find({responder:req.user._id,isNotification: false}).sort({time: +1}).populate("requester").populate("responder").exec(function(err, allTransactions){
            if(err){
                console.log("Error!");
            } else {
                Transaction.find({redirection: true,head: req.user._id,interacceptance: true}).sort({time: +1}).populate("requester").populate("responder").exec(function(errors,chainedTransaction){
                    if(errors){
                        console.log(errors);
                    }else{
                        // console.log(chainedTransaction);
                        // res.send("OK!");
                        Transaction.find({responder:req.user._id,isNotification: true}).sort({time: +1}).populate("requester").populate("responder").exec(function(err,notifications){
                            // console.log("Notifications received!");
                            // console.log(notifications);
                            Transaction.find({requester:req.user._id}).sort({time: +1}).populate("requester").populate("responder").exec(function(err,adminreqs){
                                res.render("transactions/index",{allTransactions: allTransactions,chainedTransaction: chainedTransaction,notifications: notifications,adminreqs: adminreqs});
                            });
                            
                        });
                        
                    }
                });
                // console.log("Extracted");
                // console.log(allTransactions);
                // res.send("OK!");
                
            }
            });
    }else{
        Transaction.find({requester:req.user._id,isNotification: false}).sort({time: +1}).populate("requester").populate("responder").exec(function(err, allTransactions){
            if(err){
                console.log("Error!");
            } else {
                // console.log("Extracted");
                // console.log(allTransactions);
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

//UPDATE - update acceptance info of a transaction
router.post("/transactions/:id/accept",middleware.isLoggedIn,function(req,res){
    Transaction.findByIdAndUpdate(req.params.id,{acceptance: true},function(err,foundtransaction){
        if(foundtransaction.headinvolved==true ){
            User.findById(foundtransaction.requester).populate("classs").exec(function(err,foundUser){
                if(foundUser.type=="user"){
                    //Getting Day of transaction creation
                    var requestdate=new Date(foundtransaction.time);
                    var requestday=requestdate.getDay()-1;
                    if(requestday!=-1){
                        foundUser.classs.timetable[requestday].lecturers.forEach(function(fac){
                            Transaction.create({requester: foundtransaction.requester,responder: fac,isNotification: true,reason: foundtransaction.reason},function(err,createdtransaction){
                                // console.log("Notifications created!");
                                // console.log(createdtransaction);
                                res.redirect("/transactions");
                            });
                        });
                    }
                }else{
                    // console.log("Admin-admin transaction");
                    res.redirect("/transactions");
                }
            });
        }else if(foundtransaction.headinvolved==false){
            // console.log("Transaction with head not involved!");
            res.redirect("/transactions");
        }
    });
});

//UPDATE - update interacceptance info of a chained transaction
router.post("/transactions/:id/forward",middleware.isLoggedIn,function(req,res){
    Transaction.findByIdAndUpdate(req.params.id,{interacceptance: true},function(err,transaction){
        res.redirect("/transactions");
    });
});

//DELETE - delete a transaction
router.post("/transactions/:id/delete",middleware.isLoggedIn,function(req,res){
    Transaction.findByIdAndRemove(req.params.id,function(err,transaction){
        if(err){
            console.log(err);
        }else{
            // console.log("Deleted=====");
            // console.log(transaction);
            res.redirect("/transactions");
        }
    });
});

module.exports = router;