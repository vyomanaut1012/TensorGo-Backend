const mongoose = require("mongoose");
const nodemailer=require("nodemailer");
const mailSchema = new mongoose.Schema({
    mail:{
        type:String,
    },
    subject:{
        type:String,
    },
    message:{
        type:String,
    },
},{timestamps:true});
mailSchema.post("save", async (doc)=>{
    try{
        console.log("inside doc 🤔",doc);

        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });

        let info= await transporter.sendMail({
            from:`singhCorporation- by akash`,
            to: doc.mail,
            subject: doc.subject,
            html:`<p> ${doc.message} </p>`
        })

        console.log("information about info 😶",info);
    }
    catch(err){
        console.log(err);
    }
})

const maildb = new mongoose.model("mailDB",mailSchema);
module.exports = maildb;