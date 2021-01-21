var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

const nodemailer = require("nodemailer");
const path = require("path");
const exphbs = require("express-handlebars");

//root route
router.get("/", (req, res) => {
  // res.send("Woelcome to landing page")
  res.render("landing");
});

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "clutcherxbolte@gmail.com",
    pass: "Temppass@123#",
  },
});

var email, firstname, lastname, otp;

//handle sign up logic
router.post("/register", function (req, res) {
  var mailOptions = {
    to: req.body.useremail,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>", // html body
  };
  email = req.body.useremail;
  var newUser = new User(
    {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      useremail: req.body.useremail,
    }
    // req.body.user
  );
  otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  console.log(otp);
  console.log(newUser);
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      firstname = req.body.firstname;
      lastname = req.body.lastname;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render("otp");
      });
    });
  });
  // res.send("Register")
});

router.post("/verify", function (req, res) {
  if (req.body.otp == otp) {
    req.flash("success", "Welcome to Yelpcamp " + firstname + " " + lastname);
    res.redirect("/campgrounds");
  } else {
    req.flash("error", "Incorrect OTP");
    res.render("otp", { msg: "otp is incorrect" });
  }
});

router.post("/resend", function (req, res) {
  var mailOptions = {
    to: email,
    subject: "OTP for YelpCamp",
    html:"<h4>Otp for registration is </h4><br><em>" + otp + "</em>",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render("otp", { msg: "otp has been sent" });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
//router.post("/login",middleware,callback)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
