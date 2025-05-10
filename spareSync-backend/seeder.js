require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const SparePart = require('./models/SparePart');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await SparePart.deleteMany();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sparesync.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin'
    });

    const part = await SparePart.create({
      name: 'iPhone Battery',
      description: 'Original battery for iPhone 11',
      price: 29.99,
      stock: 100,
      brand: null,
      gadgetType: null,
      manufacturer: null,
      condition: null,
      status: null
    });

    console.log('Seed data inserted');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();


// //Then run
// node seeder.js