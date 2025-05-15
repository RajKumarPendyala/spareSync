const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { deleteUploadedFile } = require('../../utils/fileCleanup');
const { emailOTP } = require('../../utils/emailOTP');
const { verifyOTP } = require('../../utils/verifyOTP');
const { verifyPassword } = require('../../utils/verifyPassword');
const { findByPhoneNumber, updateOne, findByEmail, findById, findByIdAndUpdate, findByRole, deleteOne, createOtpUser, findBy } = require('./userService');


exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role
    } = req.body;

    const existingUser = await findByPhoneNumber({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const updateFields = { name, phoneNumber, password, role};

    const filter = {
      isVerified : true,
      email
    }

    const removeFields = {
      resetTokenExpires : "",
      token : ""
    }

    const result = await updateOne({
      filter,
      updateFields,
      removeFields
    });

    if (!result) return res.status(500).json({ message: 'User could not be registered. Please try again.'});
    
    return res.status(201).json({ message: 'User registered successfully.'});

  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(
      email,
      '_id name passwordHash role image.path isverified'
    );
    
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await verifyPassword(password, user.passwordHash);

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
    next(err);
  }
};


exports.getProfileById = async (req, res, next) => {
  try{
    const _id = req.user?._id;

    if (!_id) {
      return res.status(401).json({ message: 'Unauthorized: No user ID.' });
    }

    const user = await findById(
      _id,
      '-_id -passwordHash -isVerified -token -resetTokenExpires -createdAt -updatedAt -__v'
    );

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    res.status(200).json({
      user
    });  
  } catch (err) {
    next(err);
  }
}


exports.editProfileById = async (req, res, next) => {
  try{
    const _id = req.user?._id;
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
    if (isDeleted !== undefined) updateFields.isDeleted = isDeleted;

    const updatedUser = await findByIdAndUpdate(
      _id,
      updateFields,
      '-_id -passwordHash -isVerified -token -resetTokenExpires -createdAt -updatedAt -__v'
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    if (updatedUser.isDeleted){
      return res.status(410).json({
          message: 'Profile has been deleted.'
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully.',
      user : updatedUser
    });
  } catch (err) {
    if(req.file) deleteUploadedFile(req.file);
    next(err);
  }
};


exports.getUsersWithFilter = async (req, res, next) => {
  try {
    const { role } = req.body;

    const filter = {
      isDeleted: false,
      isVerified: true
    };

    if (role) filter.role = role;

    const users = await findByRole(
      filter,
      '-passwordHash -token -resetTokenExpires -__v'
    );

    res.status(200).json({
      message: 'Users fetched successfully.',
      users : users
    });

  } catch (err) {
    next(err);
  }
};


exports.editUserById = async(req, res, next) => {
  try{
    const { _id, isDeleted } = req.body;

    const updatedUser = await findByIdAndUpdate(
      _id,
      { isDeleted },
      '-_id -passwordHash -token -resetTokenExpires -__v'
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (updatedUser.isDeleted){
      res.status(410).json({
          message: 'User deleted successfully.'
      });
    }

    res.status(200).json({
      message: 'User updated successfully.',
      user : updatedUser
    });

  } catch (err) {
    next(err);
  }
};


exports.sendOtpToEmail = async(req, res, next) => {
  try{
    const {email} = req.body;

    const existingUser = await findByEmail({ email });

    if (existingUser){
      if (existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already exists.' });
      }

      await deleteOne({ email });
    }
    
    const otp = await emailOTP(email);

    if(!otp) {
      res.status(500).json({ message: 'Failed to send OTP.' });
    }

    await createOtpUser(email, otp);

    res.status(200).json({ message: 'OTP sent successfully.' });
  }catch (error) {
    next(err);
  }
}

exports.updateUserPassword = async(req, res, next) => {
  try{
    const _id = req.user._id;
    const {
      email,
      otp,
      currentPassword,
      newPassword
    } = req.body;

    const user = await findBy(
      { $or: [{ _id }, { email }] },
      'passwordHash token resetTokenExpires'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if(currentPassword) verifyPassword(currentPassword, user.passwordHash);

    if(otp) verifyOTP(otp, user.token, user.resetTokenExpires);
    
    const removeFields = {
      resetTokenExpires : "",
      token : ""
    }

    await updateOne(
      { $or: [{ _id }, { email }] },
      { password : newPassword },
      removeFields
    );

    res.status(200).json({ message: 'User password updated successfully.' });
  }catch (error) {
    next(error);
  }
}


exports.verifyEmail = async(req, res, next) => {
  try{
    const {email, otp} = req.body;

    const user = await findByEmail(
      { email },
      'token resetTokenExpires'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await verifyOTP(otp, user.token, user.resetTokenExpires);

    await updateOneSet(
      email,
      { isVerified : true }
    );

    res.status(201).json({message: 'Email verified successfully.'});
  }catch (error){
    next(error);
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
  