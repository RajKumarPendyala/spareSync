const express = require('express');
const router = express.Router();

const sparePartController = require('./sparePartController');
const isSeller = require('../../middleware/isSeller');
const authMiddleware = require('../../middleware/authMiddleware');


router.get('/', sparePartController.getAllSparePartsWithFilters);
router.get('/:id', sparePartController.getSparePartById);

router.get('/seller', authMiddleware, isSeller, sparePartController.getSpareParts);
router.post('/seller', authMiddleware, isSeller, sparePartController.addSparePart);
router.patch('/seller/:id', authMiddleware, isSeller, sparePartController.updateSparePart);

router.patch('/admin/:id', authMiddleware, isAdmin, sparePartController.updateSparePart);


module.exports = router;