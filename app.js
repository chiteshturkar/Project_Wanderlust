if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const Joi = require('joi');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');
 

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SECRET,
  touchAfter: 24*7*60*60
})

store.on("error",() => {
  console.log("Error occurred",err);
})

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    store,
    secret:"mySecretstring",
    resave:false,
    saveUninitialized: false,
    cookie: {
      expires:Date.now()+ 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true //security purpose (cross-scripting attacks)
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs',ejsMate);

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));

main()
 .then(()=>{
    console.log("connected to DB");
 })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(dbUrl);
}

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

app.get("/error-test", (req, res, next) => {
  next(new Error("This is a test error!"));
});


// app.get("/demoUser",async(req,res)=>{
//   let fakeUser = new User({
//     email: "chitesh@gmail.com",
//     username: "chitesh"
//   });
//   let registeredUser = await User.register(fakeUser,"12345");
//   res.send(registeredUser);
// })



// app.get("/testListing", async (req,res)=>{
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: "1200",
//     location: "Calangute,Goa",
//     country: "India",
//   });

//   await sampleListing.save(); 
//   console.log("sample was saved");
//   res.send("successful testing");
// });


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});