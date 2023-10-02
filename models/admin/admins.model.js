const mongoose = require("mongoose");
const adminSchema = require("../../schemas/admin/admins.schema");

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
