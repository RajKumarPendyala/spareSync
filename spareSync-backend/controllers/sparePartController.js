const SparePart = require('../models/SparePart');

exports.getAllSpareParts = async (req, res) => {
  try {
    const parts = await SparePart.find().populate('brand gadgetType manufacturer condition status');
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parts', error: err.message });
  }
};

exports.getSparePartById = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id).populate('brand gadgetType manufacturer condition status');
    if (!part) return res.status(404).json({ message: 'Spare part not found' });
    res.json(part);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch part', error: err.message });
  }
};

exports.createSparePart = async (req, res) => {
  try {
    const part = new SparePart(req.body);
    await part.save();
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create part', error: err.message });
  }
};

exports.updateSparePart = async (req, res) => {
  try {
    const part = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!part) return res.status(404).json({ message: 'Part not found' });
    res.json(part);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update part', error: err.message });
  }
};

exports.deleteSparePart = async (req, res) => {
  try {
    const part = await SparePart.findByIdAndDelete(req.params.id);
    if (!part) return res.status(404).json({ message: 'Part not found' });
    res.json({ message: 'Spare part deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete part', error: err.message });
  }
};
