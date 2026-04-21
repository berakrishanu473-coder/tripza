const Listing = require("../models/listing.js");

const maptiler = require("@maptiler/client");
maptiler.config.apiKey = process.env.MAP_ACCESS_KEY;

module.exports.indexRoute = async(req, res)=> {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
};

module.exports.renderNewForm = (req, res)=> {
    res.render("listings/new.ejs");
};

module.exports.showRoute = async(req, res)=> {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for, does not exist!");
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createRoute = async(req, res, next)=> {
    let response = await maptiler.geocoding.forward(
        (req.body.listing.location), 
        {
            limit: 1
        });


    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = req.body.listing;
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.features[0].geometry;
    let saveList = await Listing.insertOne(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async(req, res)=> {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for, does not exist!");
        return res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateRoute = async(req, res)=> {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

        if(typeof req.file !== 'undefined'){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
};


module.exports.deleteRoute = async(req, res)=> {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!")
        res.redirect('/listings');
};