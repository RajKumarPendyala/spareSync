const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        sparePart: { type: mongoose.Schema.Types.ObjectId, ref: "SparePart", required: true},
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Total quantity must be one or positive']
        },
        subTotal:{
            type: mongoose.Types.Decimal128,
            required: true,
            min: [0, 'subTotal amount must be zero or positive']
        }
      },
    ],
    shipmentStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    PaymentStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        required: true,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
    transactionId: String,
    totalAmount: {
      type: mongoose.Types.Decimal128,
      min: [0, 'Total amount must be zero or positive']
    },
    taxAmount: {
      type: mongoose.Types.Decimal128,
      min: [0, 'Tax must be zero or positive']
    },
    discountAmount: {
      type: mongoose.Types.Decimal128,
      min: [0, 'Discount must be zero or positive']
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
