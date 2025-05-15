const bcrypt = require('bcrypt');

exports.verifyPassword = async (password, passwordHash) => {
    const isMatch = await bcrypt.compare(password, passwordHash);
    
    if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
    }
}