const mongoose = require('mongoose');

const gadgetTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('GadgetType', gadgetTypeSchema);
