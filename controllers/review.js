const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById( id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
   
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success","new review created!!");
    res.redirect(`/listings/${listing._id}`);
   };

   module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params; 

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," review deleted!!");
    res.redirect(`/listings/${id}`);
  };