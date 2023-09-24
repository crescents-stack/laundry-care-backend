const mongoose = require('mongoose');
const userSchema = require('../../schemas/users/users.schema');

const User = mongoose.model('User', userSchema);

module.exports = User;
