var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Transaction = require("../models/transaction");
var Event=require("../models/event");
var middleware = require("../middleware");

router.get("/events/new",middleware.isLoggedIn,(req,res)=>{
    
    res.render("events/new",{nos: req.query.nos});
});


router.post("/events",middleware.isLoggedIn,(req,res)=>{
    var data,event;
    var choice=req.body.reqtype;
   
    //Checking request type
    if(choice==1){
        data={isoneday: true,startdate: req.body.data.startdate};
    }else if(choice==2){
        data={isseveraldays: true,startdate: req.body.data.startdate,enddate: req.body.data.enddate};
    }
    else if(choice==3){
        data={isperiods: true,startdate: req.body.data.startdate,startperiod: req.body.data.startperiod,endperiod: req.body.data.endperiod};
    }
    event=data;
    event.organizers=req.body.organizers;
    event.org=req.body.org;
    Event.create(event,(err,createdEvent)=>{
        res.send({eve: createdEvent});
    });
    
})

module.exports = router;