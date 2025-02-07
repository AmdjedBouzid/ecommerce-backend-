const mongoose = require("mongoose");

const PerfumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  bottles: [
    {
      size: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  images: {
    type: [String],
    required: true,
  },
  Brand: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Brand",
  },
});

const Perfume =
  mongoose.models.Perfume || mongoose.model("Perfume", PerfumeSchema);

module.exports = Perfume;
