const express=require("express");
const router= express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const wrapAsync= require("../utils/wrapAsync.js");

//
module.exports.renderSignUpform=(req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signup=async(req,res)=>{

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

}

//login
module.exports.renderLoginForm=(req,res)=>{

    res.render("users/login.ejs");
 
    }

//
module.exports.login= (req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirecturl=res.locals.redirecturl || "/listings";
     res.redirect("/listings");
 }

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout successfully");
        res.redirect("/listings");
    })

}