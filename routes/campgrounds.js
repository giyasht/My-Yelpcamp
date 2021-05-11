var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //no need to write index.js because it is by default considered file

var fs = require("fs");
var path = require("path");

//INDEX - show all
router.get("/", (req, res) => {
  //Getting all  from db
  Campground.find({}, function (err, allcmpgs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allcmpgs, currentUser: req.user });
    }
  });
});

//CREATE - add new campground to DB
//both get and post are diff despite they are same links
router.post("/", middleware.isLoggedIn, (req, res, next) => {
  var author = {
    id: req.user._id,
    username: req.user.username,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
  };
  var newCampground = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    author: author,
  };
  //Creating new campground and pushing to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      req.flash("error", "Some error occured");
    } else {
      newlyCreated.images.push(req.body.image);
      newlyCreated.save();
      req.flash(
        "success",
        "Successfully added campground, refresh to see changes!"
      );
      res.redirect("/campgrounds");
    }
  });
});

//NEW ROute
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW route
router.get("/:id", function (req, res) {
  //find the campg with provided ID
  //render show template with that campg
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
  // res.send("THis is gonna be show page")
});

//EDIT campground route
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        //foundCampground.user.id ======>    Object
        //req.user._id =======>String
        res.render("campgrounds/edit", { campground: foundCampground });
      }
    });
  }
);

router.get("/:id/images/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/newimage", { campground_id: req.params.id });
});
router.post("/:id/images/new", middleware.isLoggedIn, (req, res) => {
  console.log(req.params.id);
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.redirect(`campgrounds/${req.params.id}`);
    } else {
      console.log(campground);
      campground.images.push(req.body.image);
      campground.save();
      req.flash("success", "Successfully added image, refresh to see changes!");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});
//UPDATE camground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //find and update
  var data = { name: req.body.name };
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    function (err, updatedCampground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        req.flash(
          "success",
          "Successfully updated your campground, refresh to see changes!"
        );
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
  //redirect somewhere
});

//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
