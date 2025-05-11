const User = require('./UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { deleteUploadedFile } = require('../../utils/fileCleanup');


exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
      res.status(400).json({ message: 'Email or phone number already exists' });
    }

    await new User({
      name,
      email,
      phoneNumber,
      passwordHash : password,
      role
    }).save();
    
    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        image: user.image?.path,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


exports.getProfile = async (req, res) => {
  try{
    const _id = req.user_id;
    if(_id){
      const user = await User.findOne({ _id });

      if (!user || user.isDeleted) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({
        name: user.name,
        image: user.image?.path,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        houseNo: user.address.houseNo,
        street: user.address.street,
        postalCode: user.address.postalCode,
        city: user.address.city,
        state: user.address.state
      });  
    }
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
}


exports.editProfile = async (req, res) => {
  try{
    const _id = req.user_id;
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
      state
    } = req.body;

    const updateFields = {};

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

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        image: updatedUser.image?.path,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        houseNo: updatedUser.address.houseNo,
        street: updatedUser.address.street,
        postalCode: updatedUser.address.postalCode,
        city: updatedUser.address.city,
        state: updatedUser.address.state
      }
    });
  } catch (err) {
    deleteUploadedFile(req.file);
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};








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





// //===========================================================
// // const getUsersWithFilters = async (req, res) => {
// //     const { role, isVerified, isDeleted, email, createdBefore, createdAfter } = req.query;
  
// //     let filter = {};
  
// //     if (role) filter.role = role;
// //     if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
// //     if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';
// //     if (email) filter.email = { $regex: email, $options: 'i' };
// //     if (createdBefore) filter.createdAt = { ...filter.createdAt, $lte: new Date(createdBefore) };
// //     if (createdAfter) filter.createdAt = { ...filter.createdAt, $gte: new Date(createdAfter) };
  
// //     const users = await User.find(filter).select('-password');
// //     res.status(200).json(users);
// //   };

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
  