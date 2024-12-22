const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ["L", "XL", "M"],
        required: true,
      },
      numbreDePiece: {
        type: Number,
        required: true,
        min: 0, // Number of pieces for the specific size
      },
    },
  ],
  totalNumberOfPieces: {
    type: Number,
    default: function () {
      return this.sizes.reduce((total, size) => total + size.numbreDePiece, 0);
    },
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
