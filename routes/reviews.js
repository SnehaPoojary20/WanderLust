const express=require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require( "../utils/ExpressErrors.js");
const {listingSchema, reviewSchema}=require("../Schema.js");
const Review =require("../models/reviews.js");
const Listing =require("../models/listing.js");
const { validateReview } = require("../middleware.js");




//Reviews
router.post("/", validateReview,wrapAsync(async(req,res)=>{
  
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("sucess","New Review created");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  //Delete Review Route
  router.delete("/:reviewID",wrapAsync(async(req,res)=>{
   let{id, reviewId}= req.params;
  
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewSchema}});
   await Review.findByIdAndDelete(reviewId);
  
   req.flash("sucess","Review Deleted");
   res.redirect(`/listings/${listing._id}`);
  }));

  module.exports=router;