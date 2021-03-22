var mongoose = require('mongoose');

//  SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name:String,
    // image:{
    //     data:Buffer,
    //     contentType:String,
    // },
    images:[String],
    description:String,
    price:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String,
        firstname:String,
        lastname:String,
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
