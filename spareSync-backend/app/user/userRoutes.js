const express = require('express');
const router = express.Router();

const userController = require('./userController');
const isAdmin = require('../../middleware/isAdmin');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');

//user
router.post('/register', userController.register); 
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfileById);
router.patch('/profile', authMiddleware, upload.single('image'), userController.editProfileById);
// router.post('/forgot-password', userController.sendOtpToEmail);
// router.post('/reset-password', userController.updateUserPassword);
// router.post('/change-password', userController.updateUserPassword);
router.get('/verify-email', userController.sendOtpToEmail);

//admin
router.get('/', authMiddleware, isAdmin, userController.getUsersWithFilter);
router.patch('/', authMiddleware, isAdmin, userController.editUserById);


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
//   "password": "raj204"
// }

// {
//     "email": "mrraj2042@gmail.com",
//     "password": "raj2004"
// }


// router.get('/stats', authMiddleware, isAdmin, userController.getPlatformStats);
