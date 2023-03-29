const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
