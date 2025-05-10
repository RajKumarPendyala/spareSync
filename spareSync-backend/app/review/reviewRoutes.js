const express = require('express');
const router = express.Router();

const reviewController = require('./reviewController');
const isAdmin = require('../../middleware/isAdmin');
const isBuyer = require('../../middleware/isBuyer');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/', authMiddleware, isBuyer, reviewController.createReview);
router.get('/', authMiddleware, isBuyer, reviewController.getReviews);
router.patch('/:id', authMiddleware, isBuyer, reviewController.updateReview);

router.get('/product/:productId', reviewController.getProductReviews);

router.patch('/admin/:id', authMiddleware, isAdmin, reviewController.updateReview);


module.exports = router;