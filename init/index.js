const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

main()
.then(()=> {
    console.log("connection successful");
})
.catch((err)=> {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '69e041f67e518feb0620b14e'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();