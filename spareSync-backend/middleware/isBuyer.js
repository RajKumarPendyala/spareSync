const User = require('../app/user/UserModel');

const isBuyer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_id);
    if (user.role === 'buyer') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Buyer only.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isBuyer;