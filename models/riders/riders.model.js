const mongoose = require('mongoose');
const riderSchema = require('../../schemas/riders/riders.schema'); // Import the Riders schema

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;
