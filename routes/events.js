var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Transaction = require("../models/transaction");
var Event=require("../models/event");
var middleware = require("../middleware");

router.get("/events/new",middleware.isLoggedIn,(req,res)=>{
    
    res.render("events/new",{nos: req.query.nos});
});


router.get("/events/:eventid",middleware.isLoggedIn,(req,res)=>{
    Event.findById(req.params.eventid).populate("organizers").populate("participants").populate("org").exec((err,event)=>{
        //res.send({event: event});
        res.render("events/show",{event: event});
    });
});

router.post("/events",middleware.isLoggedIn,(req,res)=>{
    var data;
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
    data.org=req.body.org;
    data.name=req.body.name;
    data.org=req.user.org;
    data.organizers=[];
    var students=[];
    adduserIDs();
    function getuserID(student){
        return User.find({username: student}).exec();
    }
    async function adduserIDs(){
        var student;
        var userobj;
        for(student of req.body.organizers){
            userobj=await getuserID(student);
            students.push(userobj[0]._id);
        }
        students.forEach(function(stu){
            data.organizers.push(stu);
        });
        completetransaction();
    }
    function completetransaction(){
        Event.create(data,function(err,newevent){
            res.redirect("/events");
        });
    }
});

router.get("/events",middleware.isLoggedIn,(req,res)=>{
    Event.find((err,events)=>{
        res.render("events/index",{events: events});
    });
});


router.post("/:eventid/participate",middleware.isLoggedIn,(req,res)=>{
    Event.findByIdAndUpdate(req.params.eventid,{ $push: { participants: req.user.id  } },(err,event)=>{
        event.participants.push(req.user.id);
        event.save();
        console.log(event);
        if(req.body.usertype=="user")
            postNotificationsforEvent(req.user.id,event);
        res.redirect("/events");
        
    });
});

function postNotificationsforEvent(userID,event){
    User.findById(userID).populate("classs").exec(function(err,subjectstudent){
        updateacceptance(subjectstudent,event);
    });

}

function updateacceptance(subjectuser,event){
    var reason="Event-"+event.name;
    var data={};
    var periodflag=false;
    //Figuring out  type of transaction 
    if(event.isoneday){
        var Dates=[];
        Dates.push(event.startdate);
        data.isoneday=true;
        data.startdate=event.startdate;
    }else if(event.isseveraldays){
        var Dates=[];
        var startdate=new Date(event.startdate);
        var enddate =new Date(event.enddate);
        data.isseveraldays=true;
        data.startdate=event.startdate;
        data.enddate=event.enddate;
        Dates=getDateArray(startdate,enddate);
    }else if(event.isperiods){
        var Dates=[];
        Dates.push(event.startdate);
        periodflag=true;
        var startperiod=event.startperiod;
        var endperiod=event.endperiod;
        data.isperiods=true;
        data.startperiod=startperiod;
        data.endperiod=endperiod;

    }
    Dates.forEach(function(date){
            //Getting Day of transaction creation
        var requestdate=new Date(date);
       
        var requestday=requestdate.getDay()-1;
        if(requestday!=-1){
            var cnt=1;
            // If only the selected day is not a Sunday!
            subjectuser.classs.timetable[requestday].lecturers.forEach(function(fac){
                if(periodflag==false|| (periodflag==true && (cnt>=startperiod && cnt<=endperiod))){
                    Transaction.create({forperiod: cnt,fordate: date,requester: subjectuser._id,responder: fac,isNotification: true,reason: reason,data: data},function(err,createdtransaction){
                        // console.log("Posted Notifications");
                        // console.log(createdtransaction);
                        // console.log("-------");
                        
                    });
                }
                cnt++;
            });
        }
    });
} 

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