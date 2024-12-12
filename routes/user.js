const express=require("express");
const router= express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");

router.get("/signup",(req,res)=>{
    res.render("users/signUp.ejs");
})

router.post("/signUp",async(req,res)=>{

try{
    let{username,email,password}=req.body;
    const newUser= new User({email,username});
    const registeredUser=User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","Welcome to WanderLust");
        res.redirect("/listings");
    })
    
}catch(error){
    req.flash("error",error.message);
}

});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" , 
    failureFlash:true}),async(req,res)=>{
    req.flash("sucess","Welcome to WanderLust !! You have Logged In");
    res.redirect("/listings");
});

router.get("logout",(req,res,next)=>{
  req.logout((err)=>{
    next(err)
  })
  req.flash("sucess","You are logged out now");
  res.redirect("/listings");
})

module.exports=router;