const express = require('express');
const router = express.Router();

const conversationController = require('./conversationController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/message', authMiddleware, conversationController.sendMessage);
router.get('/', authMiddleware, conversationController.getConversation);
router.patch('/', authMiddleware, conversationController.deleteConversation); 

module.exports = router;