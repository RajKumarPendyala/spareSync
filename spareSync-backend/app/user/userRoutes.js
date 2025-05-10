const express = require('express');
const router = express.Router();

const userController = require('./userController');
const isAdmin = require('../../middleware/isAdmin');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');

//user
router.post('/register', upload.single('image'), userController.register); // upload.array('images', 5)
// router.post('/login', userController.login);
// router.post('/logout', userController.logout);
// router.get('/profile', authMiddleware, userController.getProfile);
// router.patch('/profile', authMiddleware, userController.updateProfile);
// router.patch('/profile/password', authMiddleware, userController.changePassword);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);
// router.get('/verify-email', userController.verifyEmail);

// //admin
// router.get('/', authMiddleware, isAdmin, userController.getUsersWithFilters);
// router.get('/:id', authMiddleware, isAdmin, userController.getUserById);
// router.patch('/:id', authMiddleware, isAdmin, userController.updateUserById);
// router.get('/stats', authMiddleware, isAdmin, userController.getPlatformStats);


module.exports = router;