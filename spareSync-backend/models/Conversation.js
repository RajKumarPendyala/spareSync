const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ], // user1_id and user2_id combined
  isDeleted: { 
    type: Boolean, 
    default: false, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);