const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  items:[{
    spareParts: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true},
    createdAt: { 
        type: Date, 
        default: Date.now,
        immutable: true, 
        required: true 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now, 
        required: true
    }
  }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);