const Listing= require("./models/listing.js");
const Review= require("./models/reviews.js");
const ExpressError=require( "./utils/ExpressErrors.js");
const {listingSchema,reviewSchema,}=require("./Schema.js");


module.exports.isLoggedin=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
        //Info of user activity
      req.session.redirectUrl= req.originalUrl;
       req.flash("error","You must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>
    {
      let {id} = req.params; 
      const listing = await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currUser._id))
      {
        req.flash('error',"you are not the owner of this listing");
        return res.redirect('/listings/${id}');
      }
      next();
    }

   module.exports. validateListing = (req, res, next) => {
        let { error } = listingSchema.validate(req.body); // Validate the request body
        if (error) {
            const errMsg = error.details.map((el) => el.message).join(", "); // Collect error messages
            throw new ExpressError(400, errMsg); // Throw a new error with the messages
        } else {
            next(); // If validation passes, proceed to the next middleware
        }
    };

    
    module.exports.validateReview = (req, res, next) => {
        let { error } = reviewSchema.validate(req.body);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
           throw new ExpressError(400, errMsg);
          }else {
            next();
          }
      };

module.exports.isreviewAuthor = async (req,res,next) =>
    {
      let {id,reviewId} = req.params; 
      const listing = await Review.findById(reviewId);
      if(!reviewId.author.equals(res.locals.currUser._id))
      {
        req.flash('error',"you are not the author of this review");
        return res.redirect('/listings/${id}');
      }
      next();
    }