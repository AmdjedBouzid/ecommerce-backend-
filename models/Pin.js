const mongoose = require("mongoose");
const PinSchema = new mongoose.Schema({
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Pin = mongoose.models.Pin || mongoose.model("Pin", PinSchema);

module.exports = Pin;
