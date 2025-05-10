const express = require('express');
const router = express.Router();

const cartItemController = require('../controllers/cartItemController');
const isBuyer = require('../middleware/isBuyer');
const authMiddleware = require('../middleware/protect');

router.post('/', authMiddleware, isBuyer, cartItemController.addItem);
router.get('/', authMiddleware, isBuyer, cartItemController.getItems);
router.patch('/:id', authMiddleware, isBuyer, cartItemController.updateItem);
router.patch('/clear', authMiddleware, isBuyer, cartItemController.removeItems);


module.exports = router;