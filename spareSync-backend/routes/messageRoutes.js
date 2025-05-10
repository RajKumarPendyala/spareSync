const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const isBuyer = require('../middleware/isBuyer');
const isSeller = require('../middleware/isSeller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, isBuyer, messageController.sendMessage);
router.patch('/:id', authMiddleware, isBuyer, messageController.editMessage);
//Get conversation between logged-in user & userId
router.get('/conversation/:userId', authMiddleware, isBuyer, messageController.getConversation); 
router.get('/buyer/conversation', authMiddleware, isBuyer, messageController.getConversations); 

router.post('/', authMiddleware, isSeller, messageController.sendMessage);
router.patch('/:id', authMiddleware, isSeller, messageController.editMessage);
router.get('/conversation/:userId', authMiddleware, isSeller, messageController.getConversation); 
router.get('/seller/conversation', authMiddleware, isSeller, messageController.getConversations); 


module.exports = router;