const bcrypt = require('bcrypt');

exports.verifyOTP = async (otp, token, resetTokenExpires) => {
    const isMatch = bcrypt.compare(otp, token);
    const currentDate = new Date();
    
    if (!isMatch || resetTokenExpires < currentDate) {
    return res.status(400).json({ message: 'Invalid OTP or OTP expried.' });
    }
}