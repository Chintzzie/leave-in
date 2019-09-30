var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    adminRoutes      = require("./routes/admins"),
    orgRoutes        = require("./routes/orgs"),
    userRoutes       = require("./routes/users"),
    transactionRoutes= require("./routes/transactions"),
    classRoutes      = require("./routes/class")
    
mongoose.connect("mongodb://localhost/leave-in");
//mongoose.connect("mongodb://dev:456456@cluster0-shard-00-00-vhanl.mongodb.net:27017,cluster0-shard-00-01-vhanl.mongodb.net:27017,cluster0-shard-00-02-vhanl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", adminRoutes);
app.use("/", orgRoutes);
app.use("/", userRoutes);
app.use("/", transactionRoutes);
app.use("/", classRoutes);


app.listen(3000, function(){
   console.log("The Leave-In Server Has Started!");
});
