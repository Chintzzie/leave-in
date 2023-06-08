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
var 
    indexRoutes      = require("./routes/index"),
    adminRoutes      = require("./routes/admins"),
    orgRoutes        = require("./routes/orgs"),
    userRoutes       = require("./routes/users"),
    transactionRoutes= require("./routes/transactions"),
    classRoutes      = require("./routes/class"),
    eventRoutes      = require("./routes/events")

const mongooseConnectionURI = "mongodb+srv://lucifer:YuVmEwsoDuu0hkzl@cluster1.gf41ojj.mongodb.net/test?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongooseConnectionURI, { dbName: "testDB" })
  .then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => {
      console.log(" Error while connecting to MongoDB")
      console.log("error: ",err)
  });
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
app.use("/", adminRoutes);
app.use("/", orgRoutes);
app.use("/", userRoutes);
app.use("/", transactionRoutes);
app.use("/", classRoutes);
app.use("/",eventRoutes);


app.listen(3001, function(){
   console.log("The Leave-In Server Has Started!");
});
