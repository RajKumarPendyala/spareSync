const SparePart = require('./SparePartModel');
const { deleteUploadedFile } = require('../../utils/fileCleanup');


exports.addSparePart = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      quantity,
      weight,
      dimension,
      color,
      brand,
      gadgetType,
      warrentyPeriod
    } = req.body;
    const addedBy = req.user_id;
    const imagePaths = req.files?.map(file => ({ path: `/uploads/${file.filename}` }));

    const addFields = {};

    if (name) addFields.name = name;
    if (description) addFields.description = description;
    if (price) addFields.price = price;
    if (discount) addFields.discount = discount;
    if (quantity) addFields.quantity = quantity;
    if (weight) addFields.weight = weight;
    if (dimension) addFields.dimension = dimension;
    if (color) addFields.color = color;
    if (brand) addFields.brand = brand;
    if (gadgetType) addFields.gadgetType = gadgetType;
    if (warrentyPeriod) addFields.warrentyPeriod = warrentyPeriod;
    if (addedBy) addFields.addedBy = addedBy;
    if (imagePaths) addFields.image = imagePaths;

    await new SparePart(addFields).save();
    
    res.status(201).json({
      message: 'Adding spare part successfully'
    });

  } catch (error) {
    console.error('Adding spare part error:', error);
    res.status(500).json({ message: 'Server error during add spare part.' });
  }
};


exports.editSparePart = async (req, res) => {
    try{
        const {
            _id,
            name,
            description,
            price,
            discount,
            quantity,
            weight,
            dimension,
            color,
            brand,
            gadgetType,
            warrentyPeriod
        } = req.body;
        const imagePaths = req.files?.map(file => ({ path: `/uploads/${file.filename}` }));

        const updateFields = {};

        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (price) updateFields.price = price;
        if (discount) updateFields.discount = discount;
        if (quantity) updateFields.quantity = quantity;
        if (weight) updateFields.weight = weight;
        if (dimension) updateFields.dimension = dimension;
        if (color) updateFields.color = color;
        if (brand) updateFields.brand = brand;
        if (gadgetType) updateFields.gadgetType = gadgetType;
        if (warrentyPeriod) updateFields.warrentyPeriod = warrentyPeriod;
        if (imagePaths) updateFields.image = imagePaths;

        const updatedSparePart = await SparePart.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ); 

        res.status(200).json({
            message: 'Spare part edited successfully',
            SparePart : {
                name : updatedSparePart.name,
                description : updatedSparePart.description,
                price : updatedSparePart.price,
                discount : updatedSparePart.discount,
                quantity : updatedSparePart.quantity,
                weight : updatedSparePart.weight,
                dimension : updatedSparePart.dimension,
                color : updatedSparePart.color,
                brand : updatedSparePart.brand,
                gadgetType : updatedSparePart.gadgetType,
                warrentyPeriod : updatedSparePart.warrentyPeriod,
                image : updatedSparePart.imagePaths
            }
        });

    }catch (error) {
        console.error('edit spare part error:', error);
        res.status(500).json({ message: 'Failed to update spare part.' });
    }
};






























// const SparePart = require('../models/SparePart');

// exports.getAllSpareParts = async (req, res) => {
//   try {
//     const parts = await SparePart.find().populate('brand gadgetType manufacturer condition status');
//     res.json(parts);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch parts', error: err.message });
//   }
// };

// exports.getSparePartById = async (req, res) => {
//   try {
//     const part = await SparePart.findById(req.params.id).populate('brand gadgetType manufacturer condition status');
//     if (!part) return res.status(404).json({ message: 'Spare part not found' });
//     res.json(part);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch part', error: err.message });
//   }
// };

// exports.createSparePart = async (req, res) => {
//   try {
//     const part = new SparePart(req.body);
//     await part.save();
//     res.status(201).json(part);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create part', error: err.message });
//   }
// };

// exports.updateSparePart = async (req, res) => {
//   try {
//     const part = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!part) return res.status(404).json({ message: 'Part not found' });
//     res.json(part);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update part', error: err.message });
//   }
// };

// exports.deleteSparePart = async (req, res) => {
//   try {
//     const part = await SparePart.findByIdAndDelete(req.params.id);
//     if (!part) return res.status(404).json({ message: 'Part not found' });
//     res.json({ message: 'Spare part deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete part', error: err.message });
//   }
// };
