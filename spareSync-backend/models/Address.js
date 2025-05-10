const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String, 
        required: true
    },
    postalCode: {
        type: Number,
        required: true,
        validate: {
            validator: (v) => /^[0-9]{4,10}$/.test(v), // accepts 4 to 10 digits
            message: props => `${props.value} is not a valid numeric postal code!`
        }
    },
    city: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'City',
        required: true,
    }
});

module.exports = mongoose.model('Address', addressSchema);