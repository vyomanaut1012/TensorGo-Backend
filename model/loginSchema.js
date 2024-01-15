const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId:{
        type:String,
    },
    displayName:{
        type:String,
    },
    email:{
        type:String,
    },
    image:{
        type:String,
    },
},{timestamps:true});


const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;