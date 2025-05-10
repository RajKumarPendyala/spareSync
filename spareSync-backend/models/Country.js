const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true 
    }
});

module.exports = mongoose.model('Country', countrySchema);