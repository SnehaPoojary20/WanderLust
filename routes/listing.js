const express=require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const User =require("../models/user.js");
const { isLoggedin ,saveRedirectUrl,isOwner ,validateListing } = require("../middleware.js");

//Index Route
router.get("/",isOwner,wrapAsync(async(req,res)=>{
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
      const listing=await Listing.findById(id).populate({path:"reviews"},populate({path:"author"})).populate("owner");
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings"); // Ensure the function exits
    }
        res.render("listings/show.ejs",{listing})
    }));
 
    
    //Create Route
    router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
        //  let result=listingSchema.validate(req.body);
        //  console.log(result);
        const newlisting= new Listing(req.body.listing);
        newlisting.owner=req.user.id;
        await newlisting.save();
        req.flash("sucess","New Listing created");
       return res.redirect("/listings")
    }));
    
// Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
       return  res.redirect("/listings");
     }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id" ,isLoggedin,isOwner, validateListing, wrapAsync(async(req,res)=>{
   let{id}=req.params;
 
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("sucess","Listing Updated !");
   return res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess","Deleted Listing");
   return res.redirect("/listings");

}));    

module.exports=router;