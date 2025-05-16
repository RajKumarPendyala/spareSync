const User = require('./UserModel');

const findBy = async (filter, projection = null) => {
    return await User.findOne( filter ).select(projection);
}

exports.updateOne = async(filter, updateFields, removeFields) =>{
    return await User.updateOne(
        filter,
        { 
            $set: updateFields,
            $unset: removeFields
        },
        { runValidators: true }
    );
}

exports.updateOneSet = async(filter, updateFields) => {
    return await User.updateOne(
        filter,
        { $set: updateFields },
        { runValidators: true }
    );
}

exports.findByIdAndUpdate = async(filter, updateFields, projection = null) => {
    return await User.findByIdAndUpdate(
        filter,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select(projection);
}

exports.deleteOne = async(filter) => {
    return User.deleteOne( filter );
}

exports.createOtpUser = async (email, otp) => {
  return await new User({
    email,
    token: otp,
    resetTokenExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
  }).save();
};

exports.findByPhoneNumber = findBy;
exports.findByEmail = findBy;
exports.findById = findBy;
exports.findByRole = findBy;
exports.findBy = findBy;