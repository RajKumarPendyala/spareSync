const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

    
app.get('/', (req, res) => {
  res.send('SpareSync API is running...');
});


app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/users/products', require('./routes/sparePartRoutes'));
// app.use('/api/users/orders', require('./routes/orderRoutes'));
// app.use('/api/users/refunds', require('./routes/refundRoutes'));
// app.use('/api/users/reviews', require('./routes/reviewRoutes'));
// app.use('/api/users/financial-reports', require('./routes/financialReportRoutes'));
// app.use('/api/users/cart/items', require('./routes/cartItemRoutes'));
// app.use('/api/users/wishlist/iterms', require('./routes/wishlistRoutes'));
// app.use('/api/users/messages', require('./routes/messageRoutes'));


module.exports = app;