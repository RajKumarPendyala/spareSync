const mongoose = require('mongoose');

const messageSubSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // By default, Mongoose auto-generates _id to disable (auto-generate) _id 

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ],
  messages: [messageSubSchema],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);




// 1. Create a new conversation:
// const Conversation = require('./models/Conversation');

// const newConvo = await Conversation.create({
//   participants: [user1Id, user2Id],
//   messages: [] 
// });


// 2. Add a message:
// await Conversation.findByIdAndUpdate(conversationId, {
//   $push: {
//     messages: {
//       sender: user1Id,
//       text: "Hey there!"
//     }
//   }
// });


// 3. Get all messages:
// const conversation = await Conversation.findById(conversationId)
//   .populate('participants', 'name')
//   .populate('messages.sender', 'name');

//   {
//     _id: '663d9a2c76f4d2...',
//     participants: [
//       { _id: '663d99...', name: 'Alice' },
//       { _id: '663d98...', name: 'Bob' }
//     ],
//     messages: [
//       {
//         sender: { _id: '663d99...', name: 'Alice' },
//         text: 'Hello Bob!',
//         read: false,
//         sentAt: '2025-05-09T11:30:00Z'
//       },
//       {
//         sender: { _id: '663d98...', name: 'Bob' },
//         text: 'Hi Alice!',
//         read: false,
//         sentAt: '2025-05-09T11:31:00Z'
//       }
//     ],
//     isDeleted: false,
//     createdAt: '2025-05-09T11:29:00Z',
//     updatedAt: '2025-05-09T11:31:00Z'
//   }  