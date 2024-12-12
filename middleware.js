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