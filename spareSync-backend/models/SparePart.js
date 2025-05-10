const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{
      path: String
    }],
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: [0, 'Price must be zero or positive']
    },
    discount: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: [0, 'discount must be zero or positive']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be one or positive']
    },
    weight: {
        type: mongoose.Types.Decimal128,
        min: [0, 'Weigth must be positive']
    },
    dimension: String,
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    gadgetType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GadgetType",
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    warrentyPeriod: {
      type: Number,
      required: true,
      min: [0, 'Warrenty must be zero or positive']
    },
    isAvailable: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true}
);

module.exports = mongoose.model("SparePart", sparePartSchema);
