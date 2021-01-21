var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    dateadded:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String,
        firstname:String,
        lastname:String
    }
});
module.exports = mongoose.model("Comment",commentSchema);