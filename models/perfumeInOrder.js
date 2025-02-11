const mongoose = require("mongoose");

const perfumeInOrderSchema = new mongoose.Schema({
  Perfume: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Perfume",
  },
  bottle: {
    size: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  Quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer.",
    },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.bottle.price * this.Quantity;
    },
  },
  State: {
    type: String,
    required: true,
    enum: ["waiting", "accepted", "rejected"],
    default: "waiting",
  },
});

const PerfumeInOrder = mongoose.model("PerfumeInOrder", perfumeInOrderSchema);

module.exports = PerfumeInOrder;
