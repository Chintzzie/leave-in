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

    var choice=req.body.reqtype;
    if(choice==1){
        var data={isoneday: true,startdate: req.body.data.startdate};
    }else if(choice==2){
        var data={isseveraldays: true,startdate: req.body.data.startdate,enddate: req.body.data.enddate};
    }
    else if(choice==3){
        var data={isperiods: true,startdate: req.body.data.startdate,startperiod: req.body.data.startperiod,endperiod: req.body.data.endperiod};
    }
    
    if(req.body.redirect!=null && req.body.redirect=="true"){
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid,redirection: true,head: req.body.head};
    }else if(req.body.redirect!=null && req.body.redirect=="false"){
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid,headinvolved: false};
    }
    else{
        var transaction={reason: req.body.cause,requester: req.user._id,responder: req.body.adminid};
    }
    transaction.data=data;   
    Transaction.create(transaction,function(err,newtransact){
        if(err){
            console.log(err);
        } else {

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
                        Transaction.find({responder:req.user._id,isNotification: true}).sort({time: +1}).populate("requester").populate("responder").exec(function(err,notifications){
                            Transaction.find({requester:req.user._id}).sort({time: +1}).populate("requester").populate("responder").exec(function(err,adminreqs){
                                res.render("transactions/index",{allTransactions: allTransactions,chainedTransaction: chainedTransaction,notifications: notifications,adminreqs: adminreqs});
                            });
                            
                        });
                        
                    }
                });
            }
            });
    }else{
        Transaction.find({requester:req.user._id,isNotification: false}).sort({time: +1}).populate("requester").populate("responder").exec(function(err, allTransactions){
            if(err){
                console.log("Error!");
            } else {
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
                    var periodflag=false;
                    //Figuring out what type of transaction 
                    if(foundtransaction.data.isoneday!=undefined){
                        var Dates=[];
                        Dates.push(foundtransaction.data.startdate);
                    }else if(foundtransaction.data.isseveraldays!=undefined){
                        var Dates=[];
                        var startdate=new Date(foundtransaction.data.startdate);
                        var enddate =new Date(foundtransaction.data.enddate);
                        Dates=getDateArray(startdate,enddate);
                    }else if(foundtransaction.data.isperiods!=undefined){
                        var Dates=[];
                        Dates.push(foundtransaction.data.startdate);
                        periodflag=true;
                        var startperiod=foundtransaction.data.startperiod;
                        var endperiod=foundtransaction.data.endperiod;
                    }
                        Dates.forEach(function(date){
                                //Getting Day of transaction creation
                            var requestdate=new Date(date);
                            var requestday=requestdate.getDay()-1;
                            if(requestday!=-1){
                                var cnt=1;
                                // If only the selected day is not a Sunday!
                                foundUser.classs.timetable[requestday].lecturers.forEach(function(fac){
                                    if(periodflag==false|| (periodflag==true && (cnt>=startperiod && cnt<=endperiod))){
                                        Transaction.create({reftransaction: foundtransaction._id,forperiod: cnt,fordate: date,requester: foundtransaction.requester,responder: fac,isNotification: true,reason: foundtransaction.reason,data: foundtransaction.data},function(err,createdtransaction){
                                            res.redirect("/transactions");
                                        });
                                    }
                                    cnt++;
                                });
                            }
                        });
                        
                    
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
            Transaction.find({reftransaction: transaction._id},function(err,foundtransactions){
                foundtransactions.forEach(function(notif){
                    Transaction.findByIdAndRemove(notif._id,function(err,thenotif){
                    });
                })
            });
            res.redirect("/transactions");
        }
    });
});


var getDateArray = function(start, end) {
    var arr = new Array(),
      dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

module.exports = router;