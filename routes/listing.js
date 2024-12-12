const express=require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js");
const ExpressError=require( "../utils/ExpressErrors.js");
const Listing =require("../models/listing.js");
const User =require("../models/user.js");
const isLoggedin=require("../middleware.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Validate the request body
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Collect error messages
        throw new ExpressError(400, errMsg); // Throw a new error with the messages
    } else {
        next(); // If validation passes, proceed to the next middleware
    }
};

//Index Route


router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
      }));
    
    //New Route
    router.get("/new",isLoggedin, (req,res)=>{
       
        res.render("listings/new.ejs")
    });
    
    //Show Route
    router.get("/:id",wrapAsync(async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id).populate("reviews").populate("owner");
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings"); // Ensure the function exits
    }
        res.render("listings/show.ejs",{listing})
    }));
 
    
    //Create Route
   router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
     let result=listingSchema.validate(req.body);
     console.log(result);
    const newlisting= new Listing(req.body.listing);
    
    await newlisting.save();
    req.flash("sucess","New Listing created");
   return res.redirect("/listings")
    
    
    
    }));
    
// Edit Route
router.get("/:id/edit",isLoggedin,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
       return  res.redirect("/listings");
     }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id" ,isLoggedin,validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing")
    }
    let{id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("sucess","Listing Updated !");
    return res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedin, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess","Deleted Listing");
   return res.redirect("/listings");

}));    

module.exports=router;