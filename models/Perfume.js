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
  sex: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
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
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Brand",
  },
  quality: { type: Number, required: true },
});

const Perfume =
  mongoose.models.Perfume || mongoose.model("Perfume", PerfumeSchema);

module.exports = Perfume;
