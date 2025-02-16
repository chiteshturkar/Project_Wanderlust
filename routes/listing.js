const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isloggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/",wrapAsync(listingController.index));
  
    //Create Route
  router.get("/new",isloggedIn,wrapAsync(listingController.renderNewForm));
  
  router.post("/", isloggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

  
    //Show Route
    router.get("/:id",wrapAsync(listingController.showListings));
  
    //Edit Route 
        //Form
   router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.renderEditForm));
        //Update
  router.put("/:id",isloggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.editListings));
  
  //Delete Route
  router.delete("/:id",isloggedIn,isOwner,wrapAsync(listingController.deleteListing));
  module.exports = router;