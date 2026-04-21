const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signUpForm, signUpRoute, logInForm, logInRoute, logOutRoute } = require("../controllers/users.js");

router
    .route("/signup")
    .get(signUpForm)
    .post(wrapAsync(signUpRoute));

router
    .route("/login")
    .get(logInForm)
    .post( 
        saveRedirectUrl,
        passport.authenticate("local", { 
            failureRedirect: '/login', 
            failureFlash: true,
        }), 
        logInRoute,
    );

router.get('/logout', logOutRoute);

module.exports = router;