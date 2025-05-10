const User = require('../app/user/UserModel');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('role');
    if (user.role.name === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isAdmin;