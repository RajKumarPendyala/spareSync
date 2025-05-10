const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  isDeleted: { 
    type: Boolean, 
    default: false, 
    required: true 
  }
}, { timestamps: { createdAt: 'sentAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Message', messageSchema);