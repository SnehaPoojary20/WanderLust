const express=require("express");
const Listing =require("../models/listing.js");
const router= express.Router();
const { isLoggedin ,saveRedirectUrl,isOwner ,validateListing } =("../middleware.js");

//Index
module.exports.index=async(req,res)=>{
const allListings=await Listing.find({});
res.render("listings/index.ejs",{allListings});
}


//New Route
module.exports.renderNewForm=(req,res)=>{
       
    res.render("listings/new.ejs")
};

//Show
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews"},populate({path:"author"})).populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings"); // Ensure the function exits
  }
      res.render("listings/show.ejs",{listing})
  };

//Create
module.exports.createListing=async(req,res,next)=>{
    const newlisting= new Listing(req.body.listing);
    newlisting.owner=req.user.id;
    await newlisting.save();
    req.flash("sucess","New Listing created");
    return res.redirect("/listings")
};

// Edit 
module.exports.editListing=async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
       return  res.redirect("/listings");
     }
    res.render("listings/edit.ejs",{listing});
};

// Update
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
  
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("sucess","Listing Updated !");
    return res.redirect(`/listings/${id}`);
 };

// Delete
 module.exports.deleteListing=async(req,res)=>{
     let {id}=req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("sucess","Deleted Listing");
    return res.redirect("/listings");
 
 };


