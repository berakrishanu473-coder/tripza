const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { 
    indexRoute, 
    renderNewForm, 
    showRoute, 
    createRoute, 
    renderEditForm, 
    updateRoute,
    deleteRoute,
} = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(indexRoute))  // Index Route
    .post(                       // Create Route
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(createRoute)
    );


// New Route
router.get('/new',
  isLoggedIn, 
  renderNewForm,
);

router
    .route("/:id")
    .get(wrapAsync(showRoute))  // show route
    .put(                       // Update Route
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(updateRoute)
    )
    .delete(                    // Delete Route
        isLoggedIn,
        isOwner,
        wrapAsync(deleteRoute)
    );


// Edit Route
router.get('/:id/edit', 
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm)
);

module.exports = router;