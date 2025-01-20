const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { 
    type: String, 
    unique: true, 
    default: function() { return this.name; }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  likedPresets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
