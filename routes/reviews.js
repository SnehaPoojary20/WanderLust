const express=require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require( "../utils/ExpressErrors.js");
const {listingSchema, reviewSchema}=require("../Schema.js");
const Review =require("../models/reviews.js");
const Listing =require("../models/listing.js");
const { validateReview ,isLoggedin , isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//Reviews
router.post("/", isLoggedin,validateReview,wrapAsync(reviewController.addReviews));
  
//Delete Review Route
router.delete("/:reviewID",isLoggedin,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;