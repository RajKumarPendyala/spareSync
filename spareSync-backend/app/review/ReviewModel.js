const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  sparePart: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true},
  rating: {
    type : Number
  },
  comment: {
    type : String
  }
}, { timestamps: { createdAt: 'sentAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Review', reviewSchema);