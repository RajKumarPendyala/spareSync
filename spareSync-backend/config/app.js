const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

    
app.get('/', (req, res) => {
  res.send('SpareSync API is running...');
});


app.use('/api/users', require('../app/user/userRoutes'));
// app.use('/api/users/products', require('../app/user/sparePartRoutes'));
// app.use('/api/users/orders', require('../app/user/orderRoutes'));
// app.use('/api/users/refunds', require('../app/user/refundRoutes'));
// app.use('/api/users/reviews', require('../app/user/reviewRoutes'));
// app.use('/api/users/financial-reports', require('../app/user/financialReportRoutes'));
// app.use('/api/users/cart/items', require('../app/user/cartRoutes'));
// app.use('/api/users/wishlist/items', require('../app/user/wishlistRoutes'));
// app.use('/api/users/conversation', require('../app/user/conversationRoutes'));


module.exports = app;