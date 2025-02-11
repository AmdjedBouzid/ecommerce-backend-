const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  to: {
    type: String,
    enum: ["home", "delivery office"],
    required: true,
  },
  address: {
    willaya: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
