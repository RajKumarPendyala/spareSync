const express = require('express');
const router = express.Router();

const conversationController = require('./conversationController');
const isBuyer = require('../../middleware/isBuyer');
const isSeller = require('../../middleware/isSeller');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/message', authMiddleware, isBuyer, conversationController.sendMessage);
router.patch('/message/:id', authMiddleware, isBuyer, conversationController.editMessage);
//Get conversation between logged-in user & userId
router.get('/:id', authMiddleware, isBuyer, conversationController.getConversation);
router.patch('/:id', authMiddleware, isBuyer, conversationController.deleteConversation); 
router.get('/', authMiddleware, isBuyer, conversationController.getConversations); 

router.post('/message', authMiddleware, isSeller, conversationController.sendMessage);
router.patch('/message/:id', authMiddleware, isSeller, conversationController.editMessage);
router.get('/:id', authMiddleware, isSeller, conversationController.getConversation);
router.patch('/:id', authMiddleware, isSeller, conversationController.deleteConversation); 
router.get('/', authMiddleware, isSeller, conversationController.getConversations); 

module.exports = router;