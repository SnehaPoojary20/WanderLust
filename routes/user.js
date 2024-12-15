const express=require("express");
const router= express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");

router.get("/signup",(req,res)=>{
    res.render("users/signUp.ejs");
})

router.post("/signUp",async(req,res)=>{

    try
    {
    let {username,email,password} = req.body;
    let newUser =  new User({email,username});
    let registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err)
        {
          return next(err);
        }
        req.flash('success',"Welcome to WanderLust!");
        res.redirect('/listings');
    })
    }
    catch(err){
        req.flash('failure',err.message);
        res.redirect('/signUp');
    }

});

module.exports=router;