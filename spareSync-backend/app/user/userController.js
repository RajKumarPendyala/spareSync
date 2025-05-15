const User = require('./UserModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { deleteUploadedFile } = require('../../utils/fileCleanup');
const { emailOTP } = require('../../utils/emailOTP');
const { verifyOTP } = require('../../utils/verifyOTP');
const { verifyPassword } = require('../../utils/verifyPassword');
const userService = require('./userService');


exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role
    } = req.body;

    const existingUser = await userService.findByPhoneNumber( phoneNumber );
    if (existingUser) {
      res.status(400).json({ message: 'Phone number already exists' });
    }

    const updateFields = {};
    updateFields.name = name;
    updateFields.phoneNumber = phoneNumber;
    updateFields.password = password;
    updateFields.role = role;

    const filter = {
      isVerified : true,
      email : email
    }

    const removeFields = {
      resetTokenExpires : "",
      token : ""
    }

    const result = await User.updateOne(
      filter,
      { 
        $set: updateFields,
        $unset: removeFields
      },
      { runValidators: true }
    );
    
    if(result) res.status(201).json({ message: 'User registered successfully.'});

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('_id name passwordHash role image.path isverified');
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    verifyPassword(password, user.passwordHash);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '10d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


exports.getProfileById = async (req, res) => {
  try{
    const _id = req.user._id;
    if(_id){
      const user = await User.findOne({ _id }).select('-_id -passwordHash -isVerified -token -resetTokenExpires -createdAt -updatedAt -__v');

      if (!user || user.isDeleted) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({
        user
      });  
    }
    res.status(404).json({ message: 'User not found.' });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
}


exports.editProfileById = async (req, res) => {
  try{
    const _id = req.user._id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const {
      name,
      email,
      phoneNumber,
      role,
      houseNo,
      street,
      postalCode,
      city,
      state,
      isDeleted
    } = req.body;

    const updateFields = { isVerified : true };

    if (name) updateFields.name = name;
    if (imagePath) updateFields.image = { path: imagePath };
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (role) updateFields.role = role;
    if (houseNo) updateFields.houseNo = houseNo;
    if (street) updateFields.street = street;
    if (postalCode) updateFields.postalCode = postalCode;
    if (city) updateFields.city = city;
    if (state) updateFields.state = state;
    if (isDeleted) updateFields.isDeleted = isDeleted;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-_id -passwordHash -isVerified -token -resetTokenExpires -createdAt -updatedAt -__v');

    if (updatedUser.isDeleted){
      res.status(200).json({
          message: 'Profile deleted successfully.'
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully.',
      user : updatedUser
    });
  } catch (err) {
    deleteUploadedFile(req.file);
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};


exports.getUsersWithFilter = async (req, res) => {
  try {
    const { role } = req.body;

    const filter = {
      isDeleted: false,
      isVerified: true
    };

    if (role) filter.role = role;

    const users = await User.find(filter).select('-passwordHash -token -resetTokenExpires -__v');

    res.status(200).json({
      message: 'Users fetched successfully.',
      users : users
    });

  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ message: 'Failed to Fetch.' });
  }
};


exports.editUserById = async(req, res) => {
  try{
    const {
      _id,
      isDeleted
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { isDeleted : isDeleted} },
      { new: true, runValidators: true }
    ).select('-_id -passwordHash -token -resetTokenExpires -__v');

    if (updatedUser.isDeleted){
      res.status(200).json({
          message: 'User deleted successfully.'
      });
    }

    res.status(200).json({
      message: 'User updated successfully.',
      user : updatedUser
    });

  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};


exports.sendOtpToEmail = async(req, res) => {
  try{
    const {email} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser.isVerified) {
      res.status(400).json({ message: 'Email already exists.' });
    }

    if (existingUser) await User.deleteOne({ email });

    const otp = await emailOTP(email);

    if(!otp) {
      res.status(500).json({ message: 'Failed to send OTP.' });
    }

    await new User({
      email,
      token : otp,
      resetTokenExpires : new Date(Date.now() + 5 * 60 * 1000) 
    }).save();

    res.status(200).json({ message: 'OTP sent successfully.' });
  }catch (error) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
}

exports.updateUserPassword = async(req, res) => {
  try{
    const _id = req.user._id;
    const {
      email,
      otp,
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findOne({ $or: [{ _id }, { email }] }).select('+passwordHash +token +resetTokenExpires');

    if(currentPassword) verifyPassword(currentPassword, user.passwordHash);

    if(otp) verifyOTP(otp, user.token, user.resetTokenExpires);
    
    const removeFields = {
      resetTokenExpires : "",
      token : ""
    }

    await User.updateOne(
      { $or: [{ _id }, { email }] },
      { 
        $set: { password : newPassword },
        $unset : removeFields 
      },
      { runValidators: true }
    );

    res.status(200).json({ message: 'User password updated successfully.' });
  }catch (error) {
    console.error('User password update error:', err);
    res.status(500).json({ message: 'Failed to update user password.' });
  }
}


exports.verifyEmail = async(req,res) => {
  try{
    const {email, otp} = req.body;

    const user = await User.findOne({ email }).select('+token +resetTokenExpires');

    verifyOTP(otp, user.token, user.resetTokenExpires);

    await User.updateOne(
      email,
      { $set: { isVerified : true } },
      { runValidators: true }
    );

    res.status(201).json({message: 'Email verified successfully.'});
  }catch (error){
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Failed to verify email.' });
  }
}














// router.get('/stats', authMiddleware, isAdmin, userController.getPlatformStats);

// const User = require('../models/User');
// const Order = require('../models/Order');
// const Product = require('../models/Product'); // If you want product stats

// // GET /api/users/stats
// const getPlatformStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const buyers = await User.countDocuments({ role: 'buyer' });
//     const sellers = await User.countDocuments({ role: 'seller' });
//     const admins = await User.countDocuments({ role: 'admin' });

//     const totalOrders = await Order.countDocuments();
//     const completedOrders = await Order.countDocuments({ status: 'Completed' });
//     const pendingOrders = await Order.countDocuments({ status: 'Pending' });
//     const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

//     const totalRevenueAgg = await Order.aggregate([
//       { $match: { status: 'Completed' } },
//       { $group: { _id: null, total: { $sum: '$totalAmount' } } }
//     ]);
//     const totalRevenue = totalRevenueAgg[0]?.total || 0;

//     // Optional: Top sellers by revenue
//     const topSellers = await Order.aggregate([
//       { $match: { status: 'Completed' } },
//       {
//         $group: {
//           _id: '$seller', // Assuming orders have a `seller` field
//           totalSales: { $sum: '$totalAmount' }
//         }
//       },
//       { $sort: { totalSales: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'sellerInfo'
//         }
//       },
//       {
//         $unwind: '$sellerInfo'
//       },
//       {
//         $project: {
//           name: '$sellerInfo.name',
//           totalSales: 1
//         }
//       }
//     ]);

//     res.status(200).json({
//       totalUsers,
//       buyers,
//       sellers,
//       admins,
//       totalOrders,
//       completedOrders,
//       pendingOrders,
//       cancelledOrders,
//       totalRevenue,
//       topSellers
//     });

//   } catch (error) {
//     console.error('Error getting stats:', error);
//     res.status(500).json({ message: 'Server error while fetching stats' });
//   }
// };


// // ==================================================
// //{
// //     "totalUsers": 2543,
// //     "buyers": 1890,
// //     "sellers": 520,
// //     "admins": 3,
// //     "totalOrders": 9800,
// //     "completedOrders": 8700,
// //     "pendingOrders": 500,
// //     "cancelledOrders": 600,
// //     "totalRevenue": 182000.75,
// //     "monthlyGrowthRate": "12.3%",
// //     "topSellers": [
// //       { "name": "TechSupply Inc.", "totalSales": 54000 },
// //       { "name": "GadgetPro", "totalSales": 39000 }
// //     ]
// //   }
  