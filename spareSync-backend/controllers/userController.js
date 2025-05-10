const User = require('../models/User');
const Role = require('../models/Role');
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');
const Address = require('../models/Address');
const { deleteUploadedFile } = require('../utils/fileCleanup');


exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      street,
      postalCode,
      city,
      state,
      country
    } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // if (!name || !email || !phoneNumber || !password || !role || !address) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
      throw new Error('Email or phone number already exists');
    }

    //role
    let roleDoc = await Role.findOne({ name: role }).select('_id');
    if(!roleDoc){
      roleDoc = await new Role({name : role}).save();
    }
    if (!roleDoc) {
      throw new Error('Failed to create or find role document');
    }
    const roleId = roleDoc._id;
    
    //country
    let countryDoc = await Country.findOne({ name: country }).select('_id');
    if(!countryDoc){
      countryDoc = await new Country({name : country}).save();
    }
    if (!countryDoc) {
      throw new Error('Failed to create or find country document');
    }
    const countryId = countryDoc._id;

    //state
    let stateDoc = await State.findOne({ name: state }).select('_id');
    if(!stateDoc){
      stateDoc = await new State({name : state, country: countryId}).save();
    }
    if (!stateDoc) {
      throw new Error('Failed to create or find state document');
    }
    const stateId = stateDoc._id;

    //city
    let cityDoc = await City.findOne({ name: city }).select('_id');
    if(!cityDoc){
      cityDoc = await new City({name : city, state: stateId}).save();
    }
    if (!cityDoc) {
      throw new Error('Failed to create or find city document');
    }
    const cityId = cityDoc._id;

    //address
    const AddressDoc = await new Address({street : street, postalCode: postalCode, city : cityId}).save();
    if (!AddressDoc) {
      throw new Error('Failed to create address document');
    }
    const addressId = AddressDoc._id;

    //user
    if(imagePath == null){
      await new User({
        name,
        email,
        phoneNumber,
        passwordHash : password,
        role : roleId,
        address : addressId
      }).save();
    }
    else{
      await new User({
        name,
        image : {
          path : imagePath
        },
        email,
        phoneNumber,
        passwordHash : password,
        role : roleId,
        address : addressId
      }).save();
    }
    
    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (error) {
    deleteUploadedFile(req.file);
    console.log('Uploaded file to delete:', req.file);
    console.error('Register error:', error);
    res.status(409).json({ message: error.message });
  }
};






































// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ name, email, password: hashedPassword, phone });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// };

// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
//   }
// };






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
  