const mongoose = require("mongoose");
const PinSchema = new mongoose.Schema({
  code: { type: String, required: true }, // PIN code
  createdAt: { type: Date, default: Date.now }, // Automatically delete after 60 seconds
});

const Pin = mongoose.models.Pin || mongoose.model("Pin", PinSchema);

module.exports = Pin;
