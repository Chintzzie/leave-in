var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");


//INDEX - show all admins
router.get("/admins/index",middleware.isLoggedIn, function(req, res){
    // Get all admins from DB
    User.find({type: "admin"}, function(err, allAdmins){
       if(err){
           console.log(err);
       } else {
          res.render("admins/index",{admins: allAdmins});
       }
    });
});

module.exports = router;