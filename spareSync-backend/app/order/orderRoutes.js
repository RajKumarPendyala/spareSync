const express = require('express');
const router = express.Router();

const orderController = require('./orderController');
const isAdmin = require('../../middleware/isAdmin');
const isBuyer = require('../../middleware/isBuyer');
const isSeller = require('../../middleware/isSeller');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/',  authMiddleware, isBuyer, orderController.placeOrder);
router.get('/', authMiddleware, isBuyer, orderController.getOrders);
router.get('/:id', authMiddleware, isBuyer, orderController.getOrderById);
router.patch('/:id', authMiddleware, isBuyer, orderController.updateOrder);

router.get('/seller', authMiddleware, isSeller, orderController.getPlacedOrders);
router.patch('/seller/status/:id', authMiddleware, isSeller, orderController.updateOrderStatus);

router.get('/admin', authMiddleware, isAdmin, orderController.viewPlatformOrders);
router.patch('/admin/:id', authMiddleware, isAdmin, orderController.updateOrderStatus);


module.exports = router;