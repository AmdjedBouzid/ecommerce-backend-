const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensures no duplicate category names
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Refers to the 'Product' model
      default: [],
    },
  ],
  img: {
    type: String, // URL of the category image
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = Category;
