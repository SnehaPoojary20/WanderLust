const express=require("express");
const Listing =require("../models/listing.js");
const router= express.Router();
const { isLoggedin ,saveRedirectUrl,isOwner ,validateListing } =("../middleware.js");

module.exports.addReviews=async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("sucess","New Review created");
    res.redirect(`/listings/${listing._id}`);
  }

module.exports.deleteReview = async(req,res)=>{
     let{id, reviewId}= req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewSchema}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("sucess","Review Deleted");
     res.redirect(`/listings/${listing._id}`);
    }