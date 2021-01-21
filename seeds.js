var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment.js");

function seedDB() {
    //Remove all campgrounds
    // Campground.remove({},function(err){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("removed all campgrounds");
    //     }
    // })    

    //adding comments to campground
    Comment.create({
        text:"Farzi comment",
        author:"Shukla"
    }),function(err,comment){
        if(err){
            console.log(err);
        }else{
            Campground.findOne({name:"RV campground"},function(err,foundCampground){
                if(err){
                    console.log(err);
                }else{
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    console.log("Created new comment");
                }
            })    
        }
    }
    //add a few campgrounds
}

module.exports = seedDB;