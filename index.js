const maildb = require("./model/MailData.js");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors({
    origin: process.env.FRONTEND,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
const userdb = require("./model/loginSchema.js");
app.use(express.json());
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const database = require("./Configuration/database.js");
database.dbconnect();
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));


//  setup passport credentials
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new OAuth2Strategy({
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log("profile" ,profile);
            try {
                let user = await userdb.findOne({ googleId: profile.id });
                if (!user) {
                    user = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });
                    await user.save();
                }
                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
);
passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));
app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/",
    failureRedirect:"http://localhost:3000/login"
}));
app.get("/login/sucess",async(req,res)=>{
    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
});

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000/login");
    })
});

app.post("/mail",async(req,res)=>{
    const {mail, subject, message} = req.body;
    console.log("mail", mail);
    const mailData = new maildb({
         mail : mail,
         subject : subject,
         message : message
    });
    mailData.save();
});

app.get("/mailapi",async (req,res)=>{
    try{
      const data=await maildb.find();
      res.send(data);
    }catch(err){
      console.log(err);
    }
});

app.get("/userapi",async (req,res)=>{
    try{
      const data=await userdb.find();
      res.send(data);
    }catch(err){
      console.log(err);
    }
});
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`connected successfully with ${PORT} port `);
})