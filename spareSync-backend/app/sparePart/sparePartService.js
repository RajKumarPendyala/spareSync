const SparePart = require('./SparePartModel');

exports.createSparePart = async ( addFields ) => {
  return await new SparePart(addFields).save();
};

exports.findByIdAndUpdate = async(filter, updateFields, projection = null) => {
    return await SparePart.findByIdAndUpdate(
        filter,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select(projection);
}

exports.find = async (filter, projection = null) => {
    return await SparePart.find( filter ).select(projection);
}