const mongoose = require("mongoose");
const shopSchema = require("../../schemas/shops/shops.schema");

const Shop = mongoose.model("Shop", shopSchema);
 
module.exports = Shop;
