const mongoose = require("mongoose");
const shopSchema = require("../../schemas/shop/shopSchema");

const Shop = mongoose.model("Shop", shopSchema);
 
module.exports = Shop;
