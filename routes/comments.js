var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")//no need to write index.js because it is by default considered file

//Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//Comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
  //lookup campground using id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // console.log(req.body.comment);
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error","Something went wrong!")
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.author.firstname = req.user.firstname;
          comment.author.lastname = req.user.lastname;
          comment.dateadded = Date.now();
          comment.save();

          campground.comments.push(comment);
          campground.save();
          req.flash("success","Successfully added your comment, refresh to see changes")
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success","Successfully updated your comment");
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

//DESTROY COMMENT
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err){
    if(err){
      res.redirect("back")
    }else{
      req.flash("success","Comment deleted");
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

module.exports = router;
