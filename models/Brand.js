const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  Perfume: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfume",
      default: [],
    },
  ],
  img: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

module.exports = Brand;
