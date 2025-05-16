const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('../uploads', express.static('uploads')); 

app.get('/', (req, res) => {
  res.send('SpareSync API is running...');
});

app.use('/api/users', require('./user/userRoutes'));
app.use('/api/users/products', require('./sparePart/sparePartRoutes'));
// app.use('/api/users/orders', require('./app/order/orderRoutes'));
// app.use('/api/users/reviews', require('./app/review/reviewRoutes'));
// app.use('/api/users/financial-reports', require('./app/financialReport/financialReportRoutes'));
// app.use('/api/users/cart/items', require('./app/cart/cartRoutes'));
// app.use('/api/users/conversation', require('./app/conversation/conversationRoutes'));

app.use(errorHandler);

module.exports = app;