const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  image: {
    path: {
      type : String
    }        
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
    type : String,
    enum: ['admin', 'seller', 'buyer'],
    required: true 
  },
  address: [
    {
      houseNo: { type: String },
      street: { type: String },
      postalCode: {
        type: String,
        validate: {
          validator: (v) => /^[0-9]{4,10}$/.test(v),
          message: (props) => `${props.value} is not a valid numeric postal code!`
        }
      },
      city: { type: String },
      state: { type: String },
      isDefault: { type: Boolean, default: false }
    }
  ],
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
  token: {
    type : String
  },
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