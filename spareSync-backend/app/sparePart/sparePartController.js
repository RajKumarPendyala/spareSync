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
    const addedBy = req.user._id;
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
            warrentyPeriod,
            isDeleted
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
        if (isDeleted) updateFields.isDeleted = isDeleted;

        const updatedSparePart = await SparePart.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ); 

        if (isDeleted){
            res.status(200).json({
                message: 'Spare part deleted successfully'
            })
        }

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


exports.getSparePartsWithFilters = async (req, res) => {
    try{
        const { gadgetType, brand } = req.body;
        const addedBy = req.user?._id || null;
        const role = req.user?.role || null;

        let filterSpareParts = {};
        if (brand) filterSpareParts.brand = brand;
        if (gadgetType) filterSpareParts.gadgetType = gadgetType;
        if(role === "seller"){
            if (addedBy) filterSpareParts.addedBy = addedBy;
        }
        filterSpareParts.isDeleted = false;

        const spareParts = await SparePart.find( filterSpareParts );
        
        const formattedParts = spareParts.map(spare => ({
            name: spare.name,
            description: spare.description,
            price: spare.price,
            discount: spare.discount,
            quantity: spare.quantity,
            weight: spare.weight,
            dimension: spare.dimension,
            color: spare.color,
            brand: spare.brand,
            gadgetType: spare.gadgetType,
            addedBy: spare.addedBy,
            warrentyPeriod: spare.warrentyPeriod,
            images: spare.images
        }));

        res.status(200).json({
            message: 'Spare parts fetched successfully',
            SpareParts : formattedParts
        });

    }catch (error) {
        console.error('fetch spare part error:', error);
        res.status(500).json({ message: 'Failed to fetch spare part.' });
    }
}