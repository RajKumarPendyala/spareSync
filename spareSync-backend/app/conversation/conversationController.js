const { sendMessage, getConversation, deleteConversation } = require('./conversationService');

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    const conversation = await sendMessage(senderId, receiverId, text);

    req.app.get('io').to(receiverId.toString()).emit('newMessage', {
        conversationId: conversation._id,
        message: conversation.messages[conversation.messages.length - 1]
    });

    if(conversation){
        return res.status(200).json({ message: 'Message sent', conversation });
    }
    res.status(400).json({ message: 'Message not sent', conversation });
  } catch (error) {
    next(error);
  }
};

  

exports.getConversation = async (req, res, next) => {
    try {
      const userId1 = req.user?._id;
      const userId2 = req.body?.id;
  
      if (!userId2) {
        return res.status(400).json({ message: 'Other user ID is required' });
      }

      const conversation = await getConversation(userId1, userId2);
      
      if(conversation){
        return res.status(200).json({ conversation });
      }
      res.status(404).json({ message : 'Conversation not found' });
    } catch (error) {
      next(error);
    }
};



exports.deleteConversation = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const otherUserId = req.body?.id;

    if (!otherUserId) {
      return res.status(400).json({ message: 'Other user ID is required' });
    }

    const deleted = await deleteConversation( userId, otherUserId );

    if (!deleted) {
      return res.status(404).json({ message: 'Conversation not found or already deleted' });
    }

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
};
