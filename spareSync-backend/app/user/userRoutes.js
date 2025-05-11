const express = require('express');
const router = express.Router();

const userController = require('./userController');
const isAdmin = require('../../middleware/isAdmin');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');

//user
router.post('/register', userController.register); 
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, upload.single('image'), userController.editProfile);
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



//test-cases
//register
// {
//   "name": "Rajkumar",
//   "email": "rajesh262001@gmail.com",
//   "phoneNumber" : 9182939889,
//   "password": "raj204",
//   "role" : "admin"
// }

// {
//   "name": "Rajkumar",
//   "email": "mrraj20042@gmail.com",
//   "phoneNumber" : 9866917011,
//   "password": "raj204",
//   "role" : "seller"
// }

// login
// {
//   "email": "rajesh262001@gmail.com",
//   "password": "raj2004"
// }

// {
//     "email": "mrraj2042@gmail.com",
//     "password": "raj2004"
// }