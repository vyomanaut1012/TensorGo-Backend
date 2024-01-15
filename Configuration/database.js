const mongoose=require("mongoose");
require("dotenv").config();
exports.dbconnect=()=>{
    mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            console.log("database is connected successfully");
        })
        .catch((err)=>{
            console.log("err kya hai bhai 🤔", err);
            console.log("connection with database is not stablized");
    })
}
