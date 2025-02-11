const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    require: true,
  },
  perfumeInOrder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerfumeInOrder",
      require: true,
    },
  ],
  State: {
    type: String,
    required: true,
    enum: ["waiting", "accepted", "rejected"],
    default: "waiting",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
