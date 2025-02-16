const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressErrors.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview} = require("../middleware.js");
const {isloggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//create review route
router.post("/",validateReview,isloggedIn,wrapAsync(reviewController.createReview));
   
//delete review route
   router.delete(
     "/:reviewId",isReviewAuthor,
     wrapAsync(reviewController.deleteReview)
   );
   module.exports = router;