const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  name: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  productImage: { type: Array, required: true },

  basePrice: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
  },

  inStock: {
    type: Number,
  },

  description: {
    type: String,
  },
});
module.exports = Product = mongoose.model("product", ProductSchema);
