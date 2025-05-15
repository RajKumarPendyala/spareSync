const User = require('./UserModel');

exports.findByPhoneNumber = async (filter) => {
    return await User.findOne({ filter });
}

// exports.find{} = async (filter) => {
//     return await User.findOne({ filter });
// }