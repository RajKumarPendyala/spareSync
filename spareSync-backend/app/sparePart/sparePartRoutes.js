const express = require('express');
const router = express.Router();

const sparePartController = require('./sparePartController');
const isSeller = require('../../middleware/isSeller');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');


// router.get('/', sparePartController.getAllSparePartsWithFilters);

// router.get('/seller', authMiddleware, isSeller, sparePartController.getSparePartsWithFilters);
router.post('/seller', authMiddleware, isSeller, upload.array('images', 5), sparePartController.addSparePart);
router.patch('/seller', authMiddleware, isSeller, upload.array('images', 5), sparePartController.editSparePart);

router.patch('/admin', authMiddleware, isAdmin, upload.array('images', 5), sparePartController.editSparePart);


module.exports = router;