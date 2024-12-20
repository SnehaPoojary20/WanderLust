const express=require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const User =require("../models/user.js");
const { isLoggedin ,saveRedirectUrl,isOwner ,validateListing } =require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
.route("/")
.get(wrapAsync(listingController.index))
// .post(
//     isLoggedin,
//     validateListing, 
//     wrapAsync(listingController.createListing)
// );
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})

//New Route
router.get("/new",isLoggedin,listingController.renderNewForm);

router.
route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner, validateListing, wrapAsync(listingController))
.delete(isLoggedin,isOwner, wrapAsync(listingController.deleteListing));    

// Edit Route
router.get("/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.editListing));

module.exports=router;