const express=require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const User =require("../models/user.js");
const { isLoggedin ,saveRedirectUrl,isOwner ,validateListing } =require("../middleware.js");
const listingController= require("../controllers/listing.js");

 //Index Route
router.get("/",wrapAsync(listingController.index));
    
    //New Route
router.get("/new",isLoggedin,listingController.renderNewForm);
    
    //Show Route
router.get("/:id",wrapAsync(listingController.showListing));
    
    //Create Route
router.post("/",validateListing, wrapAsync(listingController.createListing));
    
// Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));

//Update Route
router.put("/:id" ,isLoggedin,isOwner, validateListing, wrapAsync(listingController));

//Delete Route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(listingController.deleteListing));    

module.exports=router;