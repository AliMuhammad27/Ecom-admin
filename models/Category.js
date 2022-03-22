const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const CategorySchema = new mongoose.Schema(
  {
    categoryTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
    },
    image: {
      type: String,
    },
    categoryCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
CategorySchema.plugin(mongoosePaginate);
module.exports = Category = mongoose.model("category", CategorySchema);
