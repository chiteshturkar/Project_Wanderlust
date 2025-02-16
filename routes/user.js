const express = require("express");
const router = express.Router();
const userRouting = require("../routes/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup",userController.renderSignUpForm)

router.post("/signup",wrapAsync(userController.signUpUser));

router.get("/login",userController.renderLoginForm);

router.post(
    "/login",
    savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),userController.loginUser);

router.get("/logout",userController.logoutUser);

module.exports = router;