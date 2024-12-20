const express = require("express");
const Listing = require("../models/listing.js");
const Review =require("../models/reviews.js");
const router = express.Router();
const { isLoggedin, saveRedirectUrl, isOwner, validateListing } = require("../middleware.js");


module.exports.addReviews = async (req, res) => {
  let listing= await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
 
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("sucess","New Review created");
  res.redirect(`/listings/${listing._id}`);
    };


module.exports.deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

       
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

 
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Could not delete review");
        res.redirect("back");
    }
};