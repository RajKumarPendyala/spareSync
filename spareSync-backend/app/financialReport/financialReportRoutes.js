const express = require('express');
const router = express.Router();

const financialReportController = require('./financialReportController');
const isAdmin = require('../../middleware/isAdmin');
const isSeller = require('../../middleware/isSeller');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/seller/summary', authMiddleware, isSeller, financialReportController.getFinancialReport);
router.get('/seller/monthly', authMiddleware, isSeller, financialReportController.getMOnthlyFinancialReport);

router.get('/seller/summary', authMiddleware, isAdmin, financialReportController.getCompleteFinancialReport);
router.get('/seller/monthly', authMiddleware, isAdmin, financialReportController.getMOnthlyCompleteFinancialReport);


module.exports = router;