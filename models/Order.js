const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  customerName: { type: String, required: true },
  customerFamilyName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phonenumber: { type: [String], required: true },
  delivery: {
    willaya: { type: String, required: true },
    municipality: { type: String, required: true },
    to: { type: String, required: true, enum: ["Home", "Delivery Office"] },
    price: { type: Number, required: true },
  },
  perfumeInOrder: [
    {
      Perfume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Perfume",
        required: true,
      },
      bottles: [
        {
          size: { type: Number, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true, default: 1 },
        },
      ],
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.perfumeInOrder.reduce((sum, item) => {
        return (
          sum +
          item.bottles.reduce(
            (bottleSum, bottle) => bottleSum + bottle.price * bottle.quantity,
            0
          )
        );
      }, this.delivery.price);
    },
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
