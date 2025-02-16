const Listing = require("../models/listing"); 

module.exports.index = async (req, res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    };

module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.createListing = async(req,res)=>{
    if(!req.body.listing){
      throw new ExpressError();
    }
    let filename = req.file.filename;
    let url =  req.file.path;
    let listing=req.body.listing;
    const newlist=new Listing(listing);
    newlist.image = {url,filename};
    newlist.owner = req.user._id;
    await newlist.save();
    
    req.flash("success","new listing created!!");
    res.redirect("/listings");
    };

    module.exports.showListings =async (req, res)=>{
        let {id}=req.params;
        const listing= await Listing.findById(id)
        .populate({
          path:"reviews",
          populate:{
            path:"author",
          }})
        .populate("owner");
        if(!listing){
          req.flash("error","doesn't exit");
          res.redirect("/listings");
        }
        res.render("listings/show.ejs", {listing});
      };

      module.exports.renderEditForm = async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
          req.flash("error","doesn't exit");
          res.redirect("/listings");
        }
        let OriginalImageUrl = listing.image.url;
        OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit.ejs",{listing,OriginalImageUrl});
      };

      module.exports.editListings = async(req,res)=>{
        if(!req.body.listing){
          throw new ExpressError();
        }
      let {id}=req.params;
      let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
      if(typeof req.file!=="undefined"){
        let filename = req.file.filename;
        let url =  req.file.path;
        listing.image = {url,filename};
        await listing.save();
      }
      req.flash("success","listing edited!!");
      res.redirect(`/listings/${id}`);
       };

       module.exports.deleteListing = async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success"," listing deleted!!");
        res.redirect("/listings");
      };