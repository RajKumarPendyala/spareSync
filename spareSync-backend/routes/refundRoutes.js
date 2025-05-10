const express = require('express');
const router = express.Router();

const refundController = require('../controllers/refundController');
const isAdmin = require('../middleware/isAdmin');
const isBuyer = require('../middleware/isBuyer');
const isSeller = require('../middleware/isSeller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, isBuyer, refundController.requestingRefund);
router.patch('/:id', authMiddleware, isBuyer, refundController.updateRequests);
router.get('/', authMiddleware, isBuyer, refundController.getRefundRequests);

router.get('/seller', authMiddleware, isSeller, refundController.refundRequests);
router.patch('/seller/:id', authMiddleware, isSeller, refundController.updateRefundRequests);

router.get('/admin', authMiddleware, isAdmin, refundController.viewRefundRequests);
router.patch('/seller/:id', authMiddleware, isAdmin, refundController.updateRefundRequests);

module.exports = router;