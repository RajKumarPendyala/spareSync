const express = require('express');
const router = express.Router();

const reviewController = require('./reviewController');
const isAdmin = require('../../middleware/isAdmin');
const isBuyer = require('../../middleware/isBuyer');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');


router.post('/', authMiddleware, isBuyer, upload.array('images', 5), reviewController.createReview);


module.exports = router;