var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  dotenv = require("dotenv"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  User = require("./models/user");

const nodemailer = require("nodemailer");
const path = require("path");
const exphbs = require("express-handlebars");

// app.engine('handlebars',exphbs({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ "}));

//requiring routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

mongoose.connect(
  process.env.DATABASEURL || "mongodb://localhost/yelp_camp_trial",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //dirname is nname of working directory more safer than only "public"
app.use(methodOverride("_method"));
app.use(flash());

dotenv.config({ path: "./config.env" });

//seedDB();	//seed the database

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: process.env.PASSWORDKEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.date = Date.now();
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("/users/:user_id", function (req, res) {
  User.findById(req.params.user_id, function (err, foundUser) {
    if (err) {
      res.flash("error", "User not found, redirected to campgrounds page!");
      res.redirect("/campgrounds");
    } else {
      Campground.find({}, function (err, allcampgrounds) {
        if (err) {
          res.send("<h4>No campgrounds found for this user</h4>");
        } else {
          res.render("userprofile", {
            user: foundUser,
            campgrounds: allcampgrounds,
          });
        }
      });
    }
  });
});

var port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log("Server started at port " + port);
});
