const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const isBuyer = require('../middleware/isBuyer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, isBuyer, wishlistController.addItem);
router.get('/', authMiddleware, isBuyer, wishlistController.getItems);
router.patch('/:id', authMiddleware, isBuyer, wishlistController.updateItem);
router.patch('/clear', authMiddleware, isBuyer, wishlistController.removeItems);


module.exports = router;