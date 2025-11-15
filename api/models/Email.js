const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  }
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
