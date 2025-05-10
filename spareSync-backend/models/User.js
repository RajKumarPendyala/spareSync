const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
  image: {
    path: String        
  },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    lowercase: true, 
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v), // Email format validation
      message: props => `${props.value} is not a valid email!`
    }
  },
  phoneNumber: { 
    type: Number, 
    unique: true, 
    required: true, 
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v), // Simple numeric validation
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  address: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Address',
    required: true 
  },
  isDeleted: { 
    type: Boolean, 
    default: false, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false, 
    required: true
  },
  token: String,
  resetTokenExpires: { 
    type : Date,
    default: Date.now, 
    required: true
  }
}, { timestamps: true });

//pre middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next(); // Skip if password not changed

  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
  next();
});

module.exports = mongoose.model('User', userSchema);



// const bcrypt = require('bcrypt'); // For password hashing
// const jwt = require('jsonwebtoken'); // For token handling


// // Middleware to update updatedAt timestamp on save
// userSchema.pre('save', function(next) {
//   if (this.isModified('passwordHash')) {
//     bcrypt.hash(this.passwordHash, 10, (err, hashedPassword) => {
//       if (err) return next(err);
//       this.passwordHash = hashedPassword;
//       next();
//     });
//   } else {
//     next();
//   }
// });

// // Method to compare hashed password
// userSchema.methods.comparePassword = function(password) {
//   return bcrypt.compare(password, this.passwordHash);
// };

// // Method to generate JWT token
// userSchema.methods.generateAuthToken = function() {
//   const payload = { userId: this._id, role: this.role };
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

