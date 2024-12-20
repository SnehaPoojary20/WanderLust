const express=require("express");
const router= express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");


router
.route("/signup")
.get(userController.renderSignUpform)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(wrapAsync(userController.renderLoginForm))
.post(
    saveRedirectUrl,
    passport.authenticate( "local",
    {failureRedirect:"/login",
    failureFlash:true
    }),
    userController.login
)

router.get("/logout",userController.logout);


module.exports=router;